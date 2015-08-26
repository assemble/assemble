var path = require('path');
var relativePath = require('relative-dest');
var red = require('ansi-red');

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

  var fromView = this.context.view;
  var toView = this.app[name].get(key);
  if (!toView || !Object.keys(toView).length) {
    var msg = 'Unable to find `' + key + '` in `' + name + '`';
    console.error(red(msg));
    return '';
  }

  var data = this.app.cache.data;
  var fromDest = fromView.data.dest;
  var toDest = toView.data.dest;
  // console.log(fromDest);
  // console.log(toDest);
  var res = relativePath(fromDest, toDest);
  // console.log(res);
  return res;
};
