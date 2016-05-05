'use strict';

var argv = require('minimist')(process.argv.slice(2));
var Time = require('time-diff');

module.exports = function(options) {
  return function(app) {
    this.define('time', new Time(argv));
  };
};

