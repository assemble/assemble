'use strict';

/**
 * Module dependencies
 */

var path = require('path');
var through = require('through2');

var exts = {
  '.md': '.html',
  '.hbs': '.html',
  '.tmpl': '.html',
  '.html': '.html',
  '.less': '.css',
  '.styl': '.css',
  '.sass': '.css',
  '.scss': '.css',
  '.css': '.css',
  '.coffee': '.js',
};

module.exports = function() {
  return through.obj(function (file, enc, cb) {
    file.path = rename(file.path);
    this.push(file);
    cb();
  });
};

function rename(fp) {
  var ext = path.extname(fp);
  var basename = path.basename(fp, ext);
  var dirname = path.dirname(fp);
  return path.join(dirname, basename) + (exts[ext] || ext);
}
