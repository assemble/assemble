'use strict';
var es = require('event-stream');
var flatten = require('lodash').flatten;

var stream = {
  join: function () {
    var args = [];
    if (arguments.length === 1 && Array.isArray(arguments[0])) {
      args = arguments[0];
    } else {
      args = [].slice.call(arguments);
    }
    return es.pipe.apply(es, flatten(args));
  }
};

module.exports = stream;