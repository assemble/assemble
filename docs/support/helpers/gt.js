'use strict';

module.exports = function gt(a, b, options) {
  return (+a) > (+b) ? options.fn(this.context) : options.inverse(this.context);
};
