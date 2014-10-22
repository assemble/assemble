/*!
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';

module.exports.wrap = function (file) {
  var wrapped = {};
  var keys = Object.keys(file), len = keys.length, i = 0;

  function defineProperty (name, props) {
    props.enumerable = true;
    Object.defineProperty(wrapped, name, props);
  }

  while (len--) {
    var key = keys[i];
    if (key !== 'path' && key.indexOf('content') === -1) {
      defineProperty(key, {
        get: function () {
          return file[key];
        },
        set: function (value) {
          file[key] = value;
        }
      });
    }
    i++;
  }

  defineProperty('path', {
    get: function () {
      return file.path;
    },
    set: function (value) {
      file.path = value;
    }
  });

  defineProperty('content', {
    get: function () {
      console.log('getting content');
      return file.contents.toString();
    },
    set: function (value) {
      console.log('updating content');
      file.contents = new Buffer(value);
    }
  });

  var obj = {};
  obj[file.path] = wrapped;
  return obj;
};