'use strict';

var utils = require('../utils');

/**
 * Generate all of the `src`/`dest` definitions in the given
 * `config` object. Used for generating [boilerplates][] and
 * [scaffolds][].
 *
 * @name .generate
 * @param {Object} `config` The configuration object to use.
 * @param {Function} `cb` Callback function, exposes `err` on the callback.
 * @return {Object} Returns the `Assemble` instance for chaining.
 * @api public
 */

module.exports = function (config) {
  return function (app) {
    app.define('generate', function (options, cb) {
      var opts = utils.merge({}, config, options);

      utils.async.each(opts.files, function (file, next) {
        utils.parallel(this.process(file, opts), next);
      }.bind(this), cb);
      return this;
    });
  };
};
