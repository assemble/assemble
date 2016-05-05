'use strict';

module.exports = function uppercase(str) {
  return typeof str === 'string' ? str.toUpperCase() : str;
};

