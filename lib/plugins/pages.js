'use strict';

/**
 * Module dependencies.
 */

var through = require('through2');
var FileLoader = require('../loader');
var _ = require('lodash');

module.exports = function pagesPlugin(assemble) {
  return function (glob, options) {
    var opts = _.extend({}, assemble.options, options);
    // Create a loader for `page`
    var page = new FileLoader(opts);
    // Normalize `pages` data structure
    var pages = page.normalize(glob, opts);

    return through.obj(function (file, enc, callback) {
      // Pass through all the files
      this.push(file);
      callback();
    }, function (callback) {

      // Push generated pages into the stream
      pages.forEach(function (file) {
        this.push(file);
      }.bind(this));
      callback();
    });
  };
};
