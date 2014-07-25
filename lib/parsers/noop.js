'use strict';

module.exports = function noopParser (options) {
  return function (file) {
    return file;
  };
};