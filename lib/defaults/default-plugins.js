'use strict';

/**
 * Module dependencies.
 */

var gutil = require('gulp-util');
var through = require('through2');
var _ = require('lodash');

/**
 * Local dependencies
 */

var init = require('../plugins/init');
var buffer = require('../plugins/buffer');
var drafts = require('../plugins/drafts');
var routes = require('../plugins/routes');
var parser = require('../plugins/parser');
var paginate = require('../plugins/paginate');
var utils = require('../utils.js');


/**
 * Default `src` plugins to run. To disable a plugin:
 *
 * ```js
 * assemble.disable('drafts plugin');
 * ```
 */

exports.src = function (assemble, options) {
  options = _.extend({}, assemble.options, options);

  function extend(opts) {
    return through.obj(function (file, enc, callback) {
      if (file.isNull()) {
        this.push(file);
        return callback();
      }

      // Extend or create the `locals` property on the file object
      file.locals = _.extend({}, opts, opts.locals, file.locals);
      this.push(file);
      callback();
    });
  }

  return {
    'init'    : init.call(assemble, options),
    'routes'  : routes.call(assemble, options),
    'buffer'  : buffer.call(assemble, options),
    'extend'  : extend.call(assemble, options),
    'parser'  : parser.call(assemble, options),
    'drafts'  : drafts.call(assemble, options),
    'paginate': paginate.call(assemble, options)
  };
};