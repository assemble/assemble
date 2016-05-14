'use strict';

var path = require('path');
var opts = {alias: {times: 'logDiff'}};
var argv = require('minimist')(process.argv.slice(2), opts);
var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

require('delete', 'del');
require('extend-shallow', 'extend');
require('gh-clone');
require('log-utils', 'log');
require('lunr');
require('mixin-deep', 'merge');
require('placeholders');
require('spawn-commands', 'cmd');
require('through2', 'through');
require('time-diff', 'Time');

require = fn;

/**
 * Expose methods from log-utils
 */

utils.colors = utils.log.colors;

/**
 * Time diffs
 */

utils.versionPath = function(structure, data, opts) {
  return utils.placeholders(opts)(structure, data);
};

utils.renameKey = function(key, view) {
  return view ? view.path : key;
};

utils.stripExtension = function(filepath, ext) {
  ext = ext || path.extname(filepath);
  return filepath.slice(0, filepath.length - ext.length);
};

if (argv.times !== true) {
  argv.logDiff = false;
}

var time = new utils.Time(utils.extend({
  formatArgs: function(timestamp, name, msg, elapsed) {
    if (name === 'build') {
      name = msg.slice(0, msg.indexOf(' '));
      msg = msg.slice(msg.indexOf(' ') + 1);
      if (name === 'starting') {
        name = utils.colors.green(name);
      } else if (name === 'finished') {
        name = utils.colors.red(name);
      } else {
        name = utils.colors.blue(name);
      }
    }
    return [timestamp, name, msg, elapsed]
  }
}, utils.argv));

utils.diff = time.diff('build', argv);

/**
 * Expose utils
 */

module.exports = utils;
