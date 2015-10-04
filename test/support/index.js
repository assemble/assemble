'use strict';

var path = require('path');
var pkg = require('load-pkg');
var lookup = require('look-up');
var assert = require('assert');
var ignore = require('./ignore');
var cache = {};

exports.containEql = function containEql(actual, expected) {
  if (Array.isArray(expected)) {
    var len = expected.length;
    while (len--) {
      exports.containEql(actual[len], expected[len]);
    }
  } else {
    for (var key in expected) {
      assert.deepEqual(actual[key], expected[key]);
    }
  }
};

exports.keys = function keys(obj) {
  var arr = [];
  for (var key in obj) {
    if (ignore.indexOf(key) === -1) {
      arr.push(key);
    }
  }
  return arr;
};

exports.resolve = function(filepath) {
  filepath = filepath || '';
  var key = 'app:' + filepath;
  if (cache.hasOwnProperty(key)) {
    return cache[key];
  }

  var prefix = pkg.name !== 'templates'
    ? 'templates'
    : '';

  var base = filepath
    ? path.join(prefix, filepath)
    : process.cwd();

  var fp = tryResolve(base);

  if (typeof fp === 'undefined') {
    throw new Error('cannot resolve: ' + fp);
  }
  return (cache[key] = require(fp));
};

function tryResolve(name) {
  try {
    return require.resolve(name);
  } catch(err) {}

  try {
    return require.resolve(path.resolve(name));
  } catch(err) {}
}

function tryRequire(name) {
  try {
    return require(name);
  } catch(err) {}

  try {
    return require(path.resolve(name));
  } catch(err) {}
}

