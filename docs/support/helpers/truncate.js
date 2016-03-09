'use strict';

module.exports = function truncate(str, num, end, options) {
  if (typeof end === 'object') {
    options = end;
    end = '';
  }
  if (str.length > num) {
    return str.substr(0, num) + end;
  }
  return str;
};

