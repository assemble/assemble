'use strict';

module.exports = function(a, b) {
  return typeof a === 'undefined' ? b : a;
};
