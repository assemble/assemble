'use strict';

/**
 * Module dependencies.
 */

var through = require('through2');
var Router = require('../router');

module.exports = function routesPlugin(options) {
  options = options || {};
  var router = options.router || new Router(options);

  return through.obj(function (file, encoding, callback) {
    if (file.isNull()) {
      this.push(file);
      return callback();
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('assemble.parse()', 'Streaming not supported'));
      return callback();
    }

    // run middleware
    router.handle(file);
    this.push(file);
    callback();
  });

};