'use strict';

/**
 * Module dependencies.
 */

var through = require('through2');
var _ = require('lodash');


module.exports = function pagesPlugin(assemble) {
  return function (config, options) {
    var opts = _.extend({}, assemble.options, options);

    // Normalize `pages` data structure
    var page = assemble.page(opts);
    var pages = page.normalize(config, opts);

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
