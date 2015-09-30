'use strict';

/**
 * Lazily required module dependencies
 */

var lazy = require('lazy-cache')(require);
var utils = lazy;

// general
lazy('async');
lazy('mixin-deep', 'merge');

// file/view utils
lazy('stream-combiner', 'combine');
lazy('through2', 'through');
lazy('vinyl-fs', 'vfs');
lazy('vinyl', 'Vinyl');

// engine/template utiles
lazy('parser-front-matter', 'matter');
lazy('engine-handlebars', 'engine');

// task utils
lazy('composer-runtimes', 'runtimes');
lazy('src-stream');
lazy('dest');

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

function handleStream(streams) {
  return arrayify(streams).map(function (stream) {
    return function (next) {
      if (typeof stream === 'function') {
        stream = stream();
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

module.exports = utils;
