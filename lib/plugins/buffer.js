'use strict';

/**
 * Module dependencies.
 */

var through = require('through2');


module.exports = function bufferPlugin() {
  var assemble = this;

  return through.obj(function (file, enc, cb) {

    // Buffer everything. Don't worry about if it's null or a stream
    assemble.files.set(file.path, file);
    cb();
  }, function (cb) {
    assemble.files.forEach(function (file) {

      // Push all the files back into the stream
      this.push(file);
    }, this);
    cb();
  });
};
