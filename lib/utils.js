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
lazy('to-vinyl');

// engine/template utiles
lazy('parser-front-matter', 'matter');
lazy('engine-handlebars', 'engine');

// task utils
lazy('composer-runtimes', 'runtimes');
lazy('src-stream');
lazy('dest');


utils.reloadViews = function reloadViews(app, key) {
  for (var name in app.views) {
    if (app.views.hasOwnProperty(name)) {
      var views = app.views[name];

      if (!key || typeof app[name][key] !== 'function') {
        app.create(name, utils.merge({}, views.options, app.options));
        delete views.options;
        app[name].addViews(views);
      }
    }
  }
};

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

/**
 * Expose utils
 */

module.exports = utils;
