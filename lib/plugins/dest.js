'use strict';

/**
 * Module dependencies.
 */

var path = require('path');
var through = require('through2');
var PluginError = require('plugin-error');
var utils = require('../utils');

/**
 * Plugin for calcuating destination paths.
 */

module.exports = plugin('assemble', 'dest');

function plugin(appname, name) {
  var pluginname = appname + '-' + name;

  return function destPlugin(destDir) {
    return through.obj(function (file, enc, cb) {
      if (file.isNull()) {
        this.push(file);
        return cb();
      }
      if (file.isStream()) {
        this.emit('error', new PluginError(pluginname, 'Streaming is not supported.'));
        return cb();
      }

      try {
        var dest = file.data.dest || {};
        if (typeof destDir === 'function') {
          dest.dirname = destDir(file);
        } else if (typeof destDir === 'string') {
          dest.dirname = path.resolve(destDir);
        } else {
          dest.dirname = path.dirname(file.path);
        }

        dest.cwd = file.cwd;
        dest.base = file.base;
        dest.relative = file.relative;
        dest.extname = path.extname(file.relative);
        dest.basename = path.basename(file.relative);
        dest.filename = utils.basename(dest.basename, dest.extname);
        dest.path = path.join(dest.dirname, dest.basename);

        file.data.__filename = dest.path;
        file.data.__dirname = dest.dirname;
        file.data.dest = dest;
        this.push(file);
        return cb();
      } catch (err) {
        this.emit('error', new PluginError(pluginname, err));
        return cb();
      }
    });
  };
}
