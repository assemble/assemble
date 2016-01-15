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

  var collection = this.app[name];
  if (typeof collection === 'undefined') {
    var msg = 'Invalid collection `' + name + '`';
    console.error(red(msg));
    return '';
  }

  var current = this.context.view;
  var target = collection.getView(key);

  if (!target || !Object.keys(target).length) {
    var msg = 'Unable target find `' + key + '` in `' + name + '`';
    console.error(red(msg));
    return '';
  }

  var fromDest = current.dest;
  var targetDest = target.dest;
  return relativePath(fromDest, targetDest);
};
