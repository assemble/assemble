'use strict';

module.exports = function join(a, b, sep, options) {
  if (typeof sep === 'object') {
    options = sep;
    sep = '/';
  }
  if (typeof sep === 'undefined') {
    sep = '/';
  }
  return [a, b].join(sep);
};
