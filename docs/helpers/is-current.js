'use strict';

module.exports = function(view, options) {
  var current = this.view;
  var res = current.key === view.key;
  // console.log(current.key, view.key, res);
  if (typeof options.fn === 'function') {
    res = res ? options.fn(this) : options.inverse(this);
  }
  return res;
};
