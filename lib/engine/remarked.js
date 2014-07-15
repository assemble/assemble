'use strict';

/**
 * Module dependencies.
 */

var file = require('fs-utils');
var extend = require('xtend');
var utils = require('./utils');

/**
 * Remarked support.
 */

var engine = module.exports = utils.fromStringRenderer('remarked');
var remarked = utils.requires.remarked || (utils.requires.remarked = require('remarked'));

/**
 * Lexer cache.
 */

engine.cache = {};


/**
 * Remarked string support.
 */

engine.render = function remarkedRender(str, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  var opts = extend({}, options);

  // cache requires .filename
  if (options.cache && !options.filename) {
    return callback(new Error('the "filename" option is required for caching'));
  }

  try {
    remarked.setOptions(opts);
		var filepath = options.filename;
    var tokens;

    if (options.cache) {
      tokens = engine.cache[filepath] || (engine.cache[filepath] = remarked.lexer(str, options));
    } else {
      tokens = remarked.lexer(str, options);
    }
    callback(null, remarked.parser(tokens, options));
    // callback(null, remarked(str).replace(/\n$/, ''), '.html');
  } catch (err) {
    callback(err);
  }
};


/**
 * ## renderMarkdown()
 *
 * Render the given `str` of Markdown and invoke the callback `callback(err, str)`.
 *
 * Options:
 *
 *   - `cache`    enable template caching
 *   - `filename` filename required for caching
 *
 * @param {String} str
 * @param {Object|Function} options or callback
 * @param {Function} callback
 * @api public
 */

engine.renderFile = function remarkedRenderFile(filepath, options, callback) {
  if ('function' === typeof options) {
    callback = options;
    options = {};
  }

  var opts = extend({}, options);
  try {
    remarked.setOptions(opts);
    options.filename = filepath;
    var str = '';

    if (options.cache) {
      str = engine.cache[filepath] || (engine.cache[filepath] = file.readFileSync(filepath));
    } else {
      str = file.readFileSync(filepath);
    }

    engine.render(str, options, callback);
  } catch (err) {
    callback(err);
  }
};


/**
 * Express support.
 */

engine.__express = engine.renderFile;