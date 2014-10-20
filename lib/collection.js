/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

var _ = require('lodash');
var inflection = require('inflection');
var utils = require('./utils');

/**
 * Export `collection`
 */

var collection = module.exports = {};


collection.update = function(col, page, context) {
  'use strict';

  if(!context[col.name]) {
    return col;
  }

  var singularName = col.inflection || inflection.singularize(col.name);
  var pageCol = context[col.name] || [];
  if(utils.toString.call(pageCol) !== '[object Array]') {
    pageCol = [pageCol];
  }

  pageCol.forEach(function(pageItem) {
    var i = _.findIndex(col.items, function(item) {
      return item[singularName] === pageItem;
    });

    if(i === -1) {
      var obj = {};
      obj[singularName] = pageItem;
      obj.pages = [page];
      col.items.push(obj);
    } else {
      col.items[i].pages.push(page);
    }
  });
  return col;
};


collection.sort = function(col) {
  'use strict';

  var descMap = ['desc', 'descending'];
  var itemMap = ['this', ''];

  var sortby = _.contains(itemMap, (col.sortby || '')) ? '' : col.sortby;
  var sortorder = _.contains(descMap, (col.sortorder || 'ASC').toLowerCase()) ? 'DESC' : 'ASC';

  if(sortby === '') {

    // sort items by the actual item
    col.items.sort(function(a, b) {
      if(a[col.inflection] && b[col.inflection]) {
        if(a[col.inflection] < b[col.inflection]) {
          return -1;
        } else if (a[col.inflection] > b[col.inflection]) {
          return 1;
        } else {
          return 0;
        }
      }
    });

    if(sortorder !== 'ASC') {
      col.items.reverse();
    }

  } else {

    // for each item sort the pages by the page.data property
    col.items.forEach(function(item) {

      item.pages.sort(function(a, b) {
        if(a.data[sortby] && b.data[sortby]) {
          if(a.data[sortby] < b.data[sortby]) {
            return -1;
          } else if (a.data[sortby] > b.data[sortby]) {
            return 1;
          } else {
            return 0;
          }
        } else {
          return 0;
        }
      });

      if(sortorder !== 'ASC') {
        item.pages.reverse();
      }

    });

    // now sort the items by the first page in each item
    col.items.sort(function(a, b) {
      if(a.pages.length > 0 && b.pages.length > 0) {
        if(a.pages[0].data[sortby] && b.pages[0].data[sortby]) {
          if(a.pages[0].data[sortby] < b.pages[0].data[sortby]) {
            return -1;
          } else if(a.pages[0].data[sortby] > b.pages[0].data[sortby]) {
            return 1;
          } else {
            return 0;
          }
        }
      } else {
        return 0;
      }
    });

    if(sortorder !== 'ASC') {
      col.items.reverse();
    }

  }

  return col;

};

/**
 * Ensures that a given named collection is present in the array of collections
 * passed as the first argument
 * @param  {Array} collections: List of collection objects
 * @param  {string} name: Name of collection to ensure
 */
collection.ensureCollection =function (collections, name) {
  'use strict';
  var index = _.findIndex(collections, function (collection) { return collection.name === name; });
  if (index === -1)
  {
    console.log('Push ', name);
    collections.push({ name: name, items:[], sortby:'', sortorder:'ASC'});
  }
  else
  {
    var item = collections[index];

    if (item.name === 'pages') {
      item.inflection = '_page';
      item.sortby = item.sortby || 'name';
      item.items = [{
        '_page': 'all',
        pages: []
      }];
      item.sortorder = item.sortorder || 'ASC';
    }
    else
    {
      item.inflection = inflection.singularize(item.name);
      item.sortby = item.sortby || '';
      item.items = item.items || [];
      item.sortorder = item.sortorder || 'ASC';
    }
  }
}

/**
 * Takes in a list of collection and turns them into a single object
 * with properties according to the names of the collections
 */
collection.normalize = function(collections) {
  'use strict';

  var rtn = {};
  collections.forEach(function(item) {
    rtn[item.name] = item;
  });
  return rtn;
};

collection.filterProperties = function(opts) {
  return _.omit(opts, [
    'defaultLayout',
    'initializeEngine',
    'registerFunctions',
    'registerPartial'
  ]);
};
