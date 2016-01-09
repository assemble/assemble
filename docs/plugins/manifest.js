'use strict';
var through = require('through2');

module.exports = function manifest (app, options) {
  var files = [];
  var rename = renamePath(options);
  return through.obj(function (file, enc, cb) {
      files.push(rename(file.relative));
      cb(null, file);
    }, function (cb) {
      var file = app.view({path: 'manifest.json', content: JSON.stringify(files, null, 2) });
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
