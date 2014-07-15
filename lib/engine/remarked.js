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

  var opts = extend({cache: false}, options);

  // cache requires .filename
  if (opts.cache && opts.cache === true && !opts.filename) {
    return callback(new Error('the "filename" option is required for caching'));
  }

  try {
    remarked.setOptions(opts);
		var filepath = opts.filename;
    var tokens;

    if (opts.cache) {
      tokens = engine.cache[filepath] || (engine.cache[filepath] = remarked.lexer(str, opts));
    } else {
      tokens = remarked.lexer(str, opts);
    }
    callback(null, remarked.parser(tokens, opts));
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