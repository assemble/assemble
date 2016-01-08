'use strict';

var relative = require('relative-dest');

module.exports = function assets() {
  var view = this.context.view;
  var dest = view.data.dest || view.path;
  var assets = this.context.assets || '';
  return relative(dest, assets);
};
