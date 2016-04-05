'use strict';

module.exports = function pascal(str) {
  return typeof str === 'string' ? str.charAt(0).toUpperCase() + str.substr(1) : str;
};

