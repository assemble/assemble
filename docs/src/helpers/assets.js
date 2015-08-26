var relativePath = require('relative-dest');

module.exports = function assets() {
  var view = this.context.view;
  var dest = view.data.dest || view.path;
  return relativePath(dest, this.context.assets || '');
};
