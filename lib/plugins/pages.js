'use strict';

/**
 * Module dependencies.
 */

var through = require('through2');


module.exports = function (assemble) {
  return function (config, options) {

    // Normalize `pages` data structure
    var page = assemble.page(options);
    var pages = page.normalize(config, options);

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