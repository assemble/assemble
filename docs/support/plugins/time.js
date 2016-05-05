'use strict';

var argv = require('minimist')(process.argv.slice(2));
var Time = require('time-diff');

module.exports = function(options) {
  return function(app) {
    this.option(argv);

    if (!this.enabled('times')) {
      this.disable('logDiff');
    }

    var time = new Time(this.options);
    this.define('time', time);
  };
};

