'use strict';

/**
 * Module dependencies.
 */

var gutil = require('gulp-util');
var through = require('through2');
var utils = require('../utils');
var _ = require('lodash');
var session = require('../session');
var path = require('path');

/**
 * Assemble renderer plugin used to render templates passed through the stream.
 * 
 * @param  {Object} `options` Additional options to use.
 * @param  {Object} `locals` Additional locals to pass to the renderer.
 * @return {Stream} Stream compatible with Assemble pipelines
 */

module.exports = function rendererPlugin(options, locals) {

  var assemble = this;
  var opts = _.extend({}, this.options, options);
  
  // get the custom file type created for this task
  var fileType = session.get('file type');

  /**
   * Actual renderer plugin used in a pipeline.
   * 
   * @param  {Object} `record` Vinyl File Object from the current stream.
   * @param  {Object} `enc` `record.contents` encoding.
   * @param  {Function} `cb` Callback to indicate when the transform function is complete.
   */
  
  return through.obj(function(record, encoding, cb) {
    if (record.isNull()) {
      this.push(record);
      return cb();
    }

    if (record.isStream()) {
      this.emit('error', new gutil.PluginError('assemble-plugin:render', 'Streaming is not supported.'));
      return cb();
    }

    try {
      // find the template associated with the vinyl record
      var stream = this;
      var key = path.basename(record.path, path.extname(record.path));
      var file = assemble['get' + fileType](key);

      // update the template information with any changes that might not have
      // been updated by reference while running through the stream
      file.content = record.contents.toString();

      // render the file template with the given locals
      assemble.render(file, locals, function(err, content) {
        if (err) {
          stream.emit('error', new gutil.PluginError('assemble-plugin:render', err));
          cb(err);
          return;
        }

        // update the vinyl record with the rendered contents
        // and push back into the stream.
        record.contents = new Buffer(content);
        stream.push(record);
        cb();
      });

    } catch (err) {
      this.emit('error', new gutil.PluginError('assemble-plugin:render', err));
      return cb();
    }
  });
};
