'use strict';

var path = require('path');
var linkTo = require('helper-link-to');
var getPkgs = require('get-pkgs');
var co = require('co');
var thunkify = require('thunkify');
var get = thunkify(getPkgs);

module.exports = function(related, options, cb) {
  var self = this;

  co(function *() {
    related = normalize(related);

    // find repos
    var repos = [];
    if (related.list) {
      repos = yield get(related.list);
      repos = repos.map(function(item) {
        return {
          title: item.name,
          url: item.homepage
        };
      });
    }

    // find internal docs
    var docs = [];
    if (related.docs) {
      docs = getDocs(related.docs, self);
    }

    var items = docs.concat(repos);

    if (options.fn) {
      return items.map(function(item) {
        return options.fn(item);
      }).join('\n');
    }
    return items;
  })
  .then(function(results) {
    cb(null, results);
  }, cb);
};

function normalize(val) {
  var res = {};
  if (Array.isArray(val)) {
    res.docs = val;
  } else if (typeof val === 'object') {
    if (val.hasOwnProperty('list') || val.hasOwnProperty('docs')) {
      res = val;
    }
  } else {
    res.docs = [val];
  }
  return res;
}

function getDocs(arr, helper) {
  var docs = [];
  var len = arr.length, i = 0;
  while (len--) {
    let item = arr[i++];
    let key, view;

    if (typeof item === 'string') {
      item = { key: item };
    }

    if (item.isView || item.isItem) {
      view = item;
    }

    key = item.key || item.name || item.url;
    if (!view) {
      view = helper.app.docs.getView(key);
    }
    if (!view && typeof helper.view.data.category === 'string') {
      view = helper.app.docs.getView(path.join(helper.view.data.category, key));
    }

    if (!view) {
      console.log(`Unable to find a view named "${key}"`);
      console.log(`Check the related items in "${helper.view.path}"`);
      continue;
    }

    item.title = item.title || view.data.title || view.key;
    item.url = linkTo.call(helper, view) || item.url;
    docs.push(item);
  }
  return docs;
}
