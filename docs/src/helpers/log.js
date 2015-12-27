'use strict';

module.exports = function log() {
  console.log.apply(console, arguments);
  return '';
};
