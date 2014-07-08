'use strict';

/**
 * Module dependencies.
 */

var file = require('fs-utils');
var remarked = require('remarked');
var utils = require('./utils');
var engine = module.exports;



/**
 * Remarked support.
 */

engine.remarked = utils.fromStringRenderer('remarked');

/**
 * Remarked string support.
 */

engine.remarked.render = function (str, options, fn) {
  var engine = utils.requires.remarked || (utils.requires.remarked = require('remarked'));
  try {
    var process = utils.cache(options) || utils.cache(options, engine(str, options));
    fn(null, process(options).replace(/\n$/, ''));
  } catch (err) {
    fn(err);
  }
};


/**
 * ## renderMarkdown()
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

engine.render = function renderMarkdown(str, options, fn) {
  if ('function' === typeof options) {
    fn = options;
    options = {};
  }

  // cache requires .filename
  if (options.cache && !options.filename) {
    return fn(new Error('the "filename" option is required for caching'));
  }

  try {
    var path = options.filename;
    var tokens;

    if (options.cache) {
      tokens = engine.cache[path] || (engine.cache[path] = remarked.lexer(str, options));
    } else {
      tokens = remarked.lexer(str, options);
    }

    fn(null, remarked.parser(tokens, options));
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