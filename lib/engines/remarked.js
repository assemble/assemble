'use strict';

/**
 * Module dependencies.
 */

var file = require('fs-utils');
var remarked = require('remarked');
var engine = module.exports;


/**
 * ## .render
 *
 * Render the given `str` of Markdown and invoke the callback `fn(err, str)`.
 *
 * Options:
 *
 *   - `cache`    enable template caching
 *   - `filename` filename required for caching
 *
 * @param {String} str
 * @param {Object|Function} options or fn
 * @param {Function} fn
 * @api public
 */

engine.render = function (str, options, fn) {
  if ('function' == typeof options) {
    fn = options, options = {};
  }

  // cache requires .filename
  if (options.cache && !options.filename) {
    return fn(new Error('the "filename" option is required for caching'));
  }

  try {
    var path = options.filename;
    var tokens = options.cache ? engine.cache[path] || (engine.cache[path] = remarked.lexer(str, options)) : remarked.lexer(str, options);
    fn(null, remarked.parser(tokens, options));
  } catch (err) {
    fn(err);
  }
};


/**
 * ## .renderFile
 *
 * Calls the `.render` method to render a markdown file at the given `path`
 * and callback `fn(err, str)`.
 *
 * @param {String} path
 * @param {Object|Function} options or callback
 * @param {Function} fn
 * @api public
 */

engine.renderFile = function (path, options, fn) {
  var key = path + ':string';

  if ('function' == typeof options) {
    fn = options, options = {};
  }

  try {
    options.filename = filepath;
    var str;

    if (options.cache) {
      str = engine.cache[filepath] || (engine.cache[filepath] = file.readFileSync(filepath));
    } else {
      str = file.readFileSync(filepath);
    }

    engine.render(str, options, fn);
  } catch (err) {
    fn(err);
  }
};


/**
 * Lexer tokens cache.
 */
engine.cache = {};

/**
 * Express support.
 */
engine.__express = engine.renderFile;