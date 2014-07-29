'use strict';

/**
 * Module dependencies.
 */

var gutil = require('gulp-util');
var through = require('through2');
var es = require('event-stream');
var _ = require('lodash');

/**
 * Local dependencies
 */

var init = require('../plugins/init');
var buffer = require('../plugins/buffer');
var drafts = require('../plugins/drafts');
var routes = require('../plugins/routes');
var parser = require('../plugins/parser');
var renderer = require('../plugins/renderer');
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
    'init'      : init.call(assemble, options),
    'routes src': routes.call(assemble, options),
    'buffer'    : buffer.call(assemble, options),
    'extend src': extend.call(assemble, options),
    'parser'    : parser.call(assemble, options),
    'drafts'    : drafts.call(assemble, options),
    'paginate'  : paginate.call(assemble, options)
  };
};


/**
 * Default `dest` plugins to run. To disable a plugin:
 *
 * ```js
 * assemble.disable('drafts plugin');
 * ```
 */

exports.dest = function (assemble, options) {
  options = _.extend({}, assemble.options, options);
  var locals = _.extend({}, options, options.locals);
  var isExtended = false;

  // TODO!
  var dest;
  function extend(opts) {
    return through.obj(function (file, enc, callback) {
      if (file.isNull()) {
        this.push(file);
        return callback();
      }

      // `file.locals` is created in src
      if (!isExtended && file.locals) {
        isExtended = true;
        _.extend(locals, file.locals || {});
      }

      if (file.dest) {
        dest = file.dest;
      }
      this.push(file);
      callback();
    });
  }

  return {
    'extend dest': extend.call(assemble, options),
    'collections': assemble.collection.call(assemble, options),
    // 'dest'       : assemble.destPath.call(assemble, dest, options),
    // 'assets'     : assemble.assetsPath.call(assemble, dest, options),
    // 'routes dest': assemble.routes.call(assemble, options),
    'render'     : renderer.call(assemble, options)
  };
};
