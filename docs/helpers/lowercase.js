'use strict';

module.exports = function lowercase(str) {
  return (typeof str === 'string' ? str.toLowerCase() : str);
};

