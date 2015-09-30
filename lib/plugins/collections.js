'use strict';

var path = require('path');

/**
 * Define default view collections
 *  | partials
 *  | layouts
 *  | pages
 *  | files
 */

module.exports = function (options) {
  options = options || {};
  options.engine = options.engine || 'hbs';

  return function (app) {
    this.create('partials', {
      engine: options.engine,
      viewType: 'partial',
      renameKey: function (fp) {
        return path.basename(fp, path.extname(fp));
      }
    });

    this.create('layouts', {
      engine: options.engine,
      viewType: 'layout',
      renameKey: function (fp) {
        return path.basename(fp, path.extname(fp));
      }
    });

    this.create('pages', {
      engine: options.engine,
      renameKey: function (fp) {
        return fp;
      }
    });

    this.create('files', {
      engine: options.engine,
      renameKey: function (fp) {
        return fp;
      }
    });
  };
};
