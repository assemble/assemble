'use strict';

var get = require('get-value');
var set = require('set-value');

var utils = require('../utils');

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

    var collections = {};
    var collectionKeys = Object.keys(opts.collections);

    var self = this;
    this.preRender(opts.regex, function(file, next) {
      var collection = self[file.options.collection];
      if (!collection) {
        return next();
      }
      collectionKeys.forEach(function(key) {
        if (collections.hasOwnProperty(key)) {
          return;
        }

        var collectionOpts = opts.collections[key];
        if (typeof collectionOpts === 'string') {
          collectionOpts = { inflection: collectionOpts };
        }
        var prop = 'data.' + collectionOpts.inflection;
        var group = collection.groupBy(prop);
        collections[key] = group;
      });
      next();
    });

    this.helper('collections', function(options) {
      if (options.fn) {
        return Object.keys(collections).map(function(key) {
          return options.fn({ name: key });
        }).join('\n');
      }
      return Object.keys(collections);
    });

    this.helper('collection', function(name, options) {
      var collection = collections[name];
      if (typeof collection === 'undefined') {
        return options.fn ? options.fn() : '';
      }

      var collectionOpts = opts.collections[name];
      if (options.fn) {
        return Object.keys(collection).map(function(inflection) {
          var list = collection.get(inflection);
          var ctx = {
            inflection: inflection
          };
          ctx[collectionOpts.inflection] = inflection;
          ctx.items = list.items;
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
