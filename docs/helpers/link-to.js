'use strict';

var path = require('path');
var red = require('ansi-red');
var relativePath = require('relative-dest');

module.exports = function linkTo(key, collectionName) {
  var name = collectionName;
  if (typeof name === 'object') {
    name = null;
  }

  name = name || 'pages';

  if (typeof this.app[name] === 'undefined') {
    var msg = 'Invalid collection `' + name + '`';
    console.error(red(msg));
    return '';
  }

  var current = this.context.view;
  var target = this.app.find(key, name);

  if (!target || !Object.keys(target).length) {
    var msg = 'Unable target find `' + key + '` in `' + name + '`';
    console.error(red(msg));
    return '';
  }

  var data = this.app.cache.data;
  var fromDest = current.data.dest;
  var targetDest = target.data.dest;

  return relativePath(fromDest, targetDest);
};
