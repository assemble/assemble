'use strict';

/**
 * Module dependencies.
 */

var file = require('fs-utils');
var remarked = require('remarked');
var utils = require('./utils');
var extend = require('xtend');

/**
 * Remarked support.
 */

var engine = module.exports = utils.fromStringRenderer('remarked');

/**
 * Remarked string support.
 */

engine.render = function remarkedRender(str, options, callback) {
  var engine = utils.requires.remarked || (utils.requires.remarked = require('remarked'));
  var opts = extend({}, options);

  try {
    remarked.setOptions(opts);
    callback(null, remarked(str).replace(/\n$/, ''), '.html');
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
    var path = options.filename;
    var tokens, str;

    if (options.cache) {
      str = engine.cache[filepath] || (engine.cache[filepath] = file.readFileSync(filepath));
      tokens = remarked.lexer(str, options);
    } else {
      str = file.readFileSync(filepath);
      tokens = remarked.lexer(str, options);
    }

    callback(null, remarked.parser(tokens, options));
  } catch (err) {
    callback(err);
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