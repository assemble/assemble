'use strict';

var path = require('path');
var through = require('through2');
var extend = require('extend-shallow');

module.exports = function manifest(app, options) {
  var opts = extend({}, options);
  var rename = renamePath(opts);
  var files = [];

  return through.obj(function(file, enc, cb) {
    files.push(rename(file.relative));
    cb(null, file);
  }, function(cb) {
    var fp = opts.base ? path.join(opts.base, 'manifest.json') : 'manifest.json';
    var content = JSON.stringify(files, null, 2);
    var file = app.view({path: fp, content: content});
    this.push(file);
    cb();
  });
};


function renamePath(options) {
  if (typeof options.renamePath === 'function') {
    return options.renamePath;
  }
  return function(fp) {
    return fp;
  };
}
