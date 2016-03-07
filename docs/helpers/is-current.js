'use strict';

module.exports = function(view, options) {
  var current = this.view;
  var res = current.key === view.key;
  if (typeof options.fn === 'function') {
    res = res ? options.fn(this) : options.inverse(this);
  }
  return res;
};
