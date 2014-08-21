'use strict';

/**
 * Module dependencies.
 */

var through = require('through2');
var loader = require('template-loader');
var _ = require('lodash');


module.exports = function pagesPlugin(assemble) {
  return function (glob, options) {
    var opts = _.extend({}, assemble.options, options);
    var templates = loader(opts);

    // Normalize `pages` data structure
    var pages = templates.load(glob, opts);

    return through.obj(function (file, enc, cb) {
      // Pass through all the files
      this.push(file);
      cb();
    }, function (cb) {

      // Push generated pages into the stream
      pages.forEach(function (file) {
        this.push(file);
      }.bind(this));
      cb();
    });
  };
};
