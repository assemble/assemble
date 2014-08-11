'use strict';

/**
 * Module dependencies.
 */

var fs = require('fs');
var delims = require('escape-delims');
var template = require('template');
var _ = require('lodash');
var utils = require('engine-utils');


/**
 * Lodash support.
 */

var engine = utils.fromStringRenderer('lodash');


/**
 * ## .render
 *
 * Lodash string support. Render the given `str` and invoke the callback `callback(err, str)`.
 *
 * @param {String} `str`
 * @param {Object|Function} `options` or callback.
 *     @property {Object} `cache` enable template caching
 *     @property {String} `filename` filename required for caching
 * @param {Function} `callback`
 * @api public
 */

engine.render = function lodashRender(str, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  var opts = _.extend({}, options);

  if (!opts.noescape) {
    str = delims.escape(str);
  }

  try {
    var tmpl = utils.cache(opts) || utils.cache(opts, template(str, null, opts));
    callback(null, delims.unescape(tmpl(opts)), '.html');
  } catch (err) {
    callback(err);
  }
};



/**
 * ## .renderFile
 *
 * Lodash file support. Render a file at the given `filepath` and callback `callback(err, str)`.
 *
 * @param {String} `path`
 * @param {Object|Function} `options` or callback function.
 * @param {Function} `callback`
 * @api public
 */

engine.renderFile = function lodashRenderFile(filepath, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  var opts = _.extend({}, options);
  try {
    var str;
    if (options.cache) {
      str = engine.cache[filepath] || (engine.cache[filepath] = fs.readFileSync(filepath, 'utf8'));
    } else {
      str = fs.readFileSync(filepath, 'utf8');
    }

    engine.render(str, opts, callback);
  } catch (err) {
    callback(err);
  }
};

engine.cache = {};


/**
 * Express support.
 */

engine.__express = engine.renderFile;


module.exports = engine;
