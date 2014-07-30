'use strict';

/**
 * Module dependencies.
 */

var through = require('through2');
var Router = require('../router');


module.exports = function routesPlugin(options) {
  var opts = _.extend({}, this.options, options);
  var router = opts.router || new Router(opts);

  return through.obj(function (file, encoding, callback) {
    if (file.isNull()) {
      this.push(file);
      return callback();
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('assemble.route()', 'Streaming not supported'));
      return callback();
    }

    // run middleware
    router.handle(file);
    this.push(file);
    callback();
  });
};

