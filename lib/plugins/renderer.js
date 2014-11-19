'use strict';

/**
 * Module dependencies.
 */

var through = require('through2');
var gutil = require('gulp-util');
var path = require('path');
var _ = require('lodash');

var session = require('../session');

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
  var taskName = session.get('task name');
  var fileType = 'page';
  var buildKey = assemble.option('renameKey') || function (fp) {
    return path.basename(fp, path.extname(fp));
  };

  // create a custom file type based on the task name to keep
  // source files separate.
  if (taskName) {
    fileType = '__task__' + taskName;
    buildKey = function (fp) {
      return path.basename(fp, path.extname(fp));
    };
  }

  var plural = assemble.collection[fileType];

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
      var key = buildKey(record.path);
      var file = assemble.views[plural][key] || assemble.views.pages[key];
      if (!file) {
        stream.push(record);
        return cb();
      }

      // update the template information with any changes that might not have
      // been updated by reference while running through the stream
      file.content = record.contents.toString();

      // render the file template with the given locals
      file.render(locals, function(err, content) {
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
