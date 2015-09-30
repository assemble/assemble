'use strict';

var utils = require('../utils');

/**
 * Copy a file from `src` to `dest` and process any templates in
 * `file.contents`.
 *
 * @name .process
 * @param {Object} `file` [Vinyl][] file object.
 * @param {Object} `options`
 * @return {Stream} Returns a stream to continue processing if needed.
 * @api public
 */

module.exports = function (config) {
  return function (app) {
    app.mixin('process', function (file, options) {
      if (file == null || typeof file !== 'object') {
        throw new TypeError('process expects file to be an object.');
      }

      options = utils.merge({}, config, options);
      file.src = Array.isArray(file.src) ? file.src[0] : file.src;
      file.path = file.path || file.src;
      var view = this.view(file.path, file);

      var opts = utils.merge({}, this.options, options, view.options);
      view.dest = view.dest || opts.dest;
      if (!view.dest) {
        throw new Error('process expects file to have a dest defined.');
      }

      // get cwd and base to use
      opts.cwd = opts.cwd || view.cwd;
      opts.base = opts.base || view.base;

      // these are necessary since `view` adds a `cwd` if not defined
      if (this.options.cwd && view.cwd === process.cwd()) {
        opts.cwd = this.options.cwd || opts.cwd;
      }
      if (this.options.base && view.base === process.cwd()) {
        opts.base = this.options.base || opts.base;
      }

      var pre = opts.preprocess || opts.pipeline || utils.identity;
      var post = opts.postprocess || utils.identity;

      var stream = this.src(view.path, opts);
      stream = utils.combine(pre(stream, this), this.renderFile());
      stream = utils.combine(post(stream, this), this.dest(view.dest, opts));
      return stream;
    });
  };
};
