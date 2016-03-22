'use strict';

var get = require('get-value');
var set = require('set-value');

var utils = require('../../utils');
// var Collection = require('./collection');
var Collections = require('./collections');

module.exports = function(config) {
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
    }, config);

    var collections = new Collections(opts);

    this.onLoad(opts.regex, function(file, next) {
      collections.addFile(file);
      next();
    });

    this.helper('collections', function(options) {
      if (options.fn) {
        return collections.keys.map(function(key) {
          return options.fn({ name: key });
        }).join('\n');
      }
      return Object.keys(collections);
    });

    this.helper('collection', function(name, options) {
      var collection = collections.getCollection(name);
      if (typeof collection === 'undefined') {
        return options.fn ? options.fn() : '';
      }

      if (options.fn) {
        return collection.keys.map(function(inflection) {
          var ctx = {
            inflection: inflection
          };
          ctx[collection.inflection] = inflection;

          var list = new List(collection.options);
          var items = collection.cache[inflection];
          ctx.items = Object.keys(items).reduce(function(acc, key) {
            acc.addItem(items[key]);
            return acc;
          }, list).sortBy().items;

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
