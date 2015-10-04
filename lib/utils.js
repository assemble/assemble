'use strict';

/**
 * Lazily required module dependencies
 */

var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

// general
require('async');
require('mixin-deep', 'merge');

// file/view
require('stream-combiner', 'combine');
require('through2', 'through');
require('vinyl-fs', 'vfs');
require('vinyl', 'Vinyl');

// engine/template utiles
require('parser-front-matter', 'matter');
require('engine-handlebars', 'engine');

// task
require('composer-runtimes', 'runtimes');
require('src-stream');
require('dest');

/**
 * Create regex to use for matching file extensions.
 *
 * @param {String|Array} `exts`
 */

utils.extRegex = function (exts) {
  return new RegExp('\\.(' + arrayify(exts).join('|') + ')$');
};

/**
 * Cast value to array
 *
 * @param {any} val
 * @return {any}
 */

utils.arrayify = function (val) {
  return Array.isArray(val) ? val : [val];
};

/**
 * Function that returns the given value unchanged.
 *
 * @param {any} val
 * @return {any}
 */

utils.identity = function (val) {
  return val;
};

/**
 * Handle streams in parallel
 */

utils.parallel = function (streams, done) {
  utils.async.parallel(handleStream(streams), done);
};

/**
 * Handle streams in series
 */

utils.series = function (streams, done) {
  utils.async.series(handleStream(streams), done);
};

function handleStream(streams, options) {
  return arrayify(streams).map(function (stream) {
    return function (next) {
      if (typeof stream === 'function') {
        stream = stream(options);
      }
      stream
        .once('error', next)
        .once('end', next);
    };
  });
}

/**
 * Expose utils
 */

require = fn;
module.exports = utils;
