'use strict';

/**
 * Module dependencies.
 */

var fs = require('fs');
var utils = require('engine-utils');
var _ = require('lodash');


/**
 * Requires cache.
 */


var requires = {};


/**
 * Handlebars support.
 */

var engine = utils.fromStringRenderer('handlebars');

/**
 * Handlebars string support. Render the given `str` and invoke the callback `callback(err, str)`.
 *
 * @param {String} `str`
 * @param {Object|Function} `options` or callback.
 *     @property {Object} `cache` enable template caching
 *     @property {String} `filename` filename required for caching
 * @param {Function} `callback`
 * @api public
 */

engine.render = function renderHandlebars(str, options, callback) {
  var handlebars = requires.handlebars || (requires.handlebars = require('handlebars'));
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  var opts = _.extend({}, options);
  var data = {};

  try {
    for (var partial in opts.partials) {
      handlebars.registerPartial(partial, opts.partials[partial]);
    }
    for (var helper in opts.helpers) {
      handlebars.registerHelper(helper, opts.helpers[helper]);
    }
    var fn = utils.cache(opts) || utils.cache(opts, handlebars.compile(str, opts));

    data = _.defaults(data, opts, opts.data);
    var tmpl = fn(data);
    callback(null, tmpl, '.html');
  } catch (err) {
    callback(err);
  }
};


/**
 * Handlebars file support. Render a file at the given `filepath` and callback `callback(err, str)`.
 *
 * @param {String} path
 * @param {Object|Function} options or callback
 * @param {Function} callback
 * @api public
 */

engine.renderFile = function renderFileHandlebars(filepath, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  var opts = _.extend({}, options);
  try {
    var str;
    if (opts.cache) {
      str = engine.cache[filepath] || (engine.cache[filepath] = fs.readFileSync(filepath, 'utf8'));
    } else {
      str = fs.readFileSync(filepath, 'utf8');
    }

    engine.render(str, opts, callback);
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

module.exports = engine;
