'use strict';

/**
 * Module dependencies.
 */

var through = require('through2');
var gutil = require('gulp-util');
var _ = require('lodash');


module.exports = function routesPlugin(options) {
  var assemble = this;
  var opts = _.extend({}, assemble.options, options);
  var router = opts.router || assemble.router;

  return through.obj(function (record, encoding, cb) {
    var stream = this;
    try {
      record.method = opts.method;
      // run middleware
      router.dispatch(record, function (err) {
        record.method = undefined;
        if (err) {
          stream.emit('error', new gutil.PluginError('assemble.route()', err));
          cb();
        } else {
          stream.push(record);
          cb();
        }
      });
    } catch (ex) {
      stream.emit('error', new gutil.PluginError('assemble.router() - dispatch', ex));
      cb();
    }
  });
};

