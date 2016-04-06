'use strict';

var markdown = require('helper-markdown');
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
      return markdown(items.map(function(item) {
        return options.fn(item);
      }).join('\n'));
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
    var item = arr[i++];
    if (typeof item === 'string') {
      item = { key: item };
    }
    var key = item.key || item.name || item.url;
    var view = helper.app.find(key);
    item.title = item.title || (view && view.data && view.data.title);
    item.url = (view && linkTo.call(helper, view)) || item.url;
    docs.push(item);
  }
  return docs;
}
