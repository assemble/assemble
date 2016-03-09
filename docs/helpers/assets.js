'use strict';

var relative = require('relative-dest');
var placeholders = require('placeholders');

module.exports = function assets() {
  var view = this.context.view;
  var dest = view.dest || view.path;
  var assets = this.context.assets || '';
  assets = placeholders()(assets, this.context);
  return relative(dest, assets);
};
