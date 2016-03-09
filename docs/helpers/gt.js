'use strict';

module.exports = function gt(a, b, options) {
  if (a > b) {
    return options.fn(this.context);
  }
  return options.inverse(this.context);
};

