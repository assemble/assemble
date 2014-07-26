'use strict';

/**
 * Module dependencies.
 */

var through = require('through2');


module.exports = function bufferPlugin() {
  var assemble = this;

  // Return the plugin
  return through.obj(function (file, encoding, next) {

    // Buffer everything. Don't worry about if it's null or a stream
    assemble.files.set(file.path, file);
    next();
  }, function (next) {

    // Push all the files back into the stream
    assemble.files.forEach(function (file) {
      this.push(file);
    }, this);
    next();
  });
};