'use strict';

module.exports = function is(a, b, options) {
  return a !== b ? options.fn(this) : '';
};
