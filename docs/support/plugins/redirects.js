'use strict';
var through = require('through2');
var arraySort = require('array-sort');

module.exports = function redirects(app) {
  var manifests = {};
  return through.obj(function(file, enc, cb) {
    var segs = file.dirname.split('/');
    var version = segs[segs.length - 1];
    manifests[version] = JSON.parse(file.contents);
    cb(null, file);
  }, function(cb) {

    var keys = Object.keys(manifests).map(toVersions);
    var versions = arraySort(keys, [
      compare('major'),
      compare('minor'),
      compare('patch')
    ]).map(function(version) {
      return version.orig;
    });

    var data = versions.reduce(function(acc, version) {
      return manifests[version].reduce(function(acc, dest) {
        var fp = dest.substr(('en/' + version + '/').length);
        acc[fp] = dest;
        return acc;
      }, acc);
    }, {});

    var file = app.view({
      path: 'redirects.json',
      content: JSON.stringify(data, null, 2)
    });

    this.push(file);
    cb();
  });
};

function compare(prop) {
  return function(a, b) {
    var aa = a[prop];
    var bb = b[prop];
    if (isWordChar(aa) || isWordChar(bb)) {
      return aa.localeCompare(bb);
    }
    aa = +aa;
    bb = +bb;
    if (aa > bb) return 1;
    if (aa < bb) return -1;
    return 0;
  };
}

function isWordChar(str) {
  return /[^\d]/.test(String(str));
}

function toVersions(str) {
  return toVersion.apply(null, [str].concat(str.split('.')));
}

function toVersion(orig, major, minor, patch) {
  var tag = '';
  var m = /^([^-]+)-(\w+)$/.exec(patch);
  if (m) {
    patch = m[1];
    tag = m[2];
  }

  return {
    orig: orig,
    major: major.slice(1),
    minor: minor,
    patch: patch,
    tag: tag
  };
}
