'use strict';

var through = require('through2');

module.exports = function versions(app) {
  var versions = {};
  return through.obj(function(file, enc, next) {
    if (file.path.indexOf('redirects.json') !== -1) {
      return next(null, file);
    }
    var segs = file.dirname.split('/');
    var version = segs[segs.length - 1];
    versions[version] = JSON.parse(file.contents);
    next(null, file);
  }, function(next) {
    var file = app.view({
      path: 'versions.json',
      content: JSON.stringify(versions, null, 2)
    });
    this.push(file);
    next();
  });
};
