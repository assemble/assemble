'use strict';

var through = require('through2');

module.exports = function manifest(app, options) {
  var rename = renamePath(options);
  var files = [];

  return through.obj(function(file, enc, cb) {
    files.push(rename(file.relative));
    cb(null, file);
  }, function(cb) {

    var content = JSON.stringify(files, null, 2);
    var file = app.view({path: 'manifest.json', content: content});
    this.push(file);
    cb();
  });
};


function renamePath(options) {
  if (options && typeof options.renamePath === 'function') {
    return options.renamePath;
  }
  return function(fp) {
    return fp;
  };
}
