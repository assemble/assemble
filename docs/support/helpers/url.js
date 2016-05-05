'use strict';

var path = require('path');
var placeholders = require('placeholders');

module.exports = function url() {
  var view = this.context.view;
  var url = this.context.url || '';
  this.context.slug = function() {
    if (view.data.category === 'docs') {
      return view.filename + '.html';
    }
    var rel = view.relative;
    var ext = path.extname(rel);
    return path.join(rel.substr(0, rel.length - ext.length) + '.html');
  };

  url = placeholders()(url, this.context);
  return url;
};
