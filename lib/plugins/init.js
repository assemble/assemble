'use strict';

/**
 * Module dependencies.
 */

var through = require('through2');
var path = require('path');
var _ = require('lodash');

module.exports = function initPlugin(options) {
  var assemble = this;
  var opts = _.extend({}, this.options, options);
  var files = [];

  function rename (filepath) {
    return filepath;
  }

  assemble.option('renameKey', rename);

  return through.obj(function (file, encoding, cb) {
    if (file.isNull()) {
      this.push(file);
      return cb();
    }

    var page = {};
    page.path = file.path;
    page.content = file.contents.toString();
    page.destExt = path.extname(page.path);

    var o = {};
    o[page.path] = page;
    assemble.page(page);
    files.push(file);
    cb();
  }, function (cb) {
    files.forEach(function (file) {
      this.push(file);
    }, this);
    cb();
  });
};
