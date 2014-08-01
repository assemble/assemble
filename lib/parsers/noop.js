'use strict';

module.exports = function noopParser () {
  return function (file) {
    return file;
  };
};