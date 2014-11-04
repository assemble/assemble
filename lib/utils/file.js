/*!
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';
var Vinyl = require('vinyl');
var _ = require('lodash');

var toVinyl = function (file) {
  var wrapped = new Vinyl(file);
  var keys = Object.keys(file), len = keys.length, i = 0;

  function defineProperty (name, props) {
    props.enumerable = true;
    Object.defineProperty(wrapped, name, props);
  }

  while (len--) {
    var key = keys[i++];
    if (key !== 'path' && key.indexOf('content') === -1) {
      defineProperty(key, {
        get: function () { return file[key]; },
        set: function (value) {file[key] = value; }
      });
    }
  }

  defineProperty('path', {
    get: function () {return file.path; },
    set: function (value) {file.path = value; }
  });

  defineProperty('contents', {
    get: function () {return new Buffer(file.content); },
    set: function (value) { file.content = value.toString(); }
  });

  console.log('wrapped', JSON.stringify(_.omit(wrapped, ['_contents', 'contents']), null, 2));
  return wrapped;
};


var toFile = function (vinyl) {
  var file = {};
  var keys = Object.keys(vinyl), len = keys.length, i = 0;

  file.path = vinyl.path;
  file.content = vinyl.contents.toString();

  while (len--) {
    var key = keys[i++];
    if (key !== 'path' && key.indexOf('content') === -1) {
      file[key] = vinyl[key];
    }
  }

  return file;
};

module.exports = {
  toVinyl: toVinyl,
  toFile: toFile
};