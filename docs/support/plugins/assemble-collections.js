'use strict';

var utils = require('../utils');
var get = require('get-value');
var set = require('set-value');

module.exports = function(options) {
  return function assembleCollections(app) {
    if (!isValidInstance(this)) {
      return;
    }

    var List = this.List;
    if (!List) {
      throw new Error('Unable to find a "List" constructor on "app".');
    }

    /**
     * 1. Add middleware to gather collection information from front-matter (data)
     * 2. Add helpers to retrieve sorted/grouped collections in templates
     * 3. ? Add data for accessing collections in templates
     */

    var opts = utils.merge({
      regex: /\.md$/,
      collections: {
        categories: {
          inflection: 'category',
          sortBy: 'asc'
        },
        tags: {
          inflection: 'tag',
          sortBy: 'asc'
        }
      }
    }, options);

    var collections = {};
    var collectionKeys = Object.keys(opts.collections);

    this.onLoad(opts.regex, function(file, next) {
      collectionKeys.forEach(function(key) {
        var categoryOpts = opts.collections[key];
        if (typeof categoryOpts === 'string') {
          categoryOpts = { inflection: categoryOpts };
        }

        var data = get(file.data, key);
        if (typeof data === 'undefined') {
          data = get(file.data, categoryOpts.inflection);
        }

        if (typeof data !== 'undefined') {
          collections[key] = collections[key] || {};

          data = Array.isArray(data) ? data : [data];
          collections[key] = data.reduce(function(acc, item) {
            acc[item] = acc[item] || {};
            if (!acc[item].hasOwnProperty(file.key)) {
              acc[item][file.key] = file;
            }
            return acc;
          }, collections[key]);
        }
      });
      next();
    });

    this.helper('collections', function(options) {
      if (options.fn) {
        return Object.keys(collections).map(function(key) {
          return options.fn({ name: key });
        }).join('\n');
      }
      return Object.keys(collections).join(', ');
    });

    this.helper('collection', function(name, options) {
      var collectionOpts = opts.collections[name];
      if (typeof collectionOpts === 'string') {
        collectionOpts = { inflection: collectionOpts };
      }

      if (!collectionOpts) {
        throw new Error('Unable to find collection "' + name + '"');
      }

      var collection = collections[name] || collections[collectionOpts.inflection];
      if (typeof collection === 'undefined') {
        return options.fn ? options.fn() : '';
      }

      if (options.fn) {
        return Object.keys(collection).map(function(inflection) {
          var ctx = {
            inflection: inflection
          };
          ctx[collectionOpts.inflection] = inflection;

          var list = new List(collectionOpts);
          ctx.items = Object.keys(collection[inflection]).reduce(function(acc, key) {
            acc.addItem(collection[inflection][key]);
            return acc;
          }, list).items;

          return options.fn(ctx);
        }).join('\n');
      }
      return collection;
    });
  };
};

function isValidInstance(app) {
  if (app.isRegistered('assemble-collections')) {
    return false;
  }
  if (app.isApp) {
    return true;
  }
  return false;
}
