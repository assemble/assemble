'use strict';

/**
 * Module dependencies.
 */

var through = require('through2');
var _ = require('lodash');
var utils = require('../utils');

module.exports = function inspect(options) {
  var opts = _.extend({}, this.options, options);

  return function (options) {
    options = options || {};

    return through.obj(function (file, encoding, cb) {
      if (opts.inspect) {
        console.log('inspect plugin: ', utils.inspect(file));
      }

      this.push(file);
      cb();
    });
  };
};
