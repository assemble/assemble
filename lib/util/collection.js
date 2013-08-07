
var inflection = require('inflection');
var _          = require('lodash');

var collection = {

  update: function(col, page, context) {

    if(!context[col.name]) {
      return col;
    }

    var singularName = col.inflection || inflection.singularize(col.name);

    var pageCol = context[col.name] || [];
    if(toString.call(pageCol) !== '[object Array]') {
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
  },

  sort: function(col) {

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

  },

  /**
   * Takes in a list of collection definitions and normalizes
   * them to a be all objects with smart defaults
   * @param  {Array} collections: List of collections as either strings or objects
   * @return {Array}             Return list of collections, all as objects
   */
  normalize: function(collections) {

    var rtn = {};
    collections.forEach(function(item) {

      if(typeof item === 'string') {
        if(rtn[item]) {
          item = rtn[item];
        } else {
          item = {
            name: item,
            inflection: inflection.singularize(item),
            sortorder: 'ASC',
            sortby: '',
            items: []
          };
        }
      } else {
        item.items = [];
      }

      if(item.name === 'pages') {
        item.inflection = '_page';
        item.sortby = (item.sortby || '') === '' ? 'name' : item.sortby;
        item.items = [{
          '_page': 'all',
          pages: []
        }];
      }

      rtn[item.name] = item;

    });

    return rtn;
  }

};


module.exports = exports = collection;
