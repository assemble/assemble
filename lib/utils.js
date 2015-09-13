
/**
 * Lazily required module dependencies
 */

var lazy = module.exports = require('lazy-cache')(require);

// object/array/type utils
lazy('async');
lazy('delegate-properties', 'delegate');
lazy('extend-shallow', 'extend');
lazy('mixin-deep', 'merge');

// file/view utils
lazy('stream-combiner', 'combine');
lazy('through2', 'through');
lazy('vinyl-fs', 'vfs');
lazy('vinyl', 'Vinyl');
lazy('src-stream');
lazy('to-vinyl');
lazy('dest');

// engine/template utiles
lazy('parser-front-matter', 'matter');
lazy('engine-handlebars', 'engine');

var utils = lazy;

utils.identity = function (obj) {
  return obj;
};

utils.parallel = function (streams, done) {
  utils.async.parallel(handleStream(streams), done);
};

utils.series = function (streams, done) {
  utils.async.series(handleStream(streams), done);
};

function handleStream(streams) {
  streams = Array.isArray(streams) ? streams : [streams];
  return streams.map(function (stream) {
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
