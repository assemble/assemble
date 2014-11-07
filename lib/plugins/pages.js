'use strict';

/**
 * Module dependencies.
 */

var through = require('through2');
var _ = require('lodash');


module.exports = function pagesPlugin(assemble) {
  return function (glob, options) {
    var opts = _.extend({}, assemble.options, options);

    assemble.pages(glob, opts);

    return through.obj(function (page, enc, cb) {
      // Pass through all the files
      this.push(page);
      cb();
    }, function (cb) {

      // Push generated pages into the stream
      _.forIn(assemble.cache.pages, function (page, key) {
        this.push(page);
      }.bind(this));
      cb();
    });
  };
};
