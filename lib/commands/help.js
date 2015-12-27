'use strict';

var utils = require('../utils');

module.exports = function(app) {
  return function(key) {
    // var commands = help();
    // console.log(commands.options[key]);
    // process.exit(0);
  };
};

/**
 * Create `help` documentation
 */

function help() {
  return {
    heading: '',
    options: {
      init: {
        description: 'Force initialization questions to be re-asked.',
        example: '',
        short: 'i'
      },
      help: {
        description: '',
        example: '',
        short: 'h'
      },
      show: {
        description: '',
        example: '',
        short: null
      },
      ask: {
        description: '',
        example: '',
        short: null
      },
      open: {
        description: '',
        example: '',
        short: 'o'
      },
      config: {
        description: '',
        example: '',
        short: 'c'
      },
      diff: {
        description: '',
        example: '',
        short: null
      },
      cwd: {
        description: '',
        example: '',
        short: null
      },
      data: {
        description: '',
        example: '',
        short: 'd'
      },
      choose: {
        description: '',
        example: '',
        short: null
      },
      tasks: {
        description: '',
        example: '',
        short: null
      }
    },
    footer: ''
  };
}

function format(obj) {
  var heading = obj.heading || '';
  var optsList = '';
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      var val = obj[key];

      optsList += toFlag(key, val.short);
      optsList += utils.wrap(val.description);
    }
  }

  return heading + '\n'
    + optsList + '\n'
    + obj.footer || '';
}

function toFlag(key, short) {
  return shortKey(short) + '--' + key + ' ';
}

function shortKey(sh) {
  return sh ? ('-' + sh + ', ') : '    ';
}

// console.log(format(help()))
