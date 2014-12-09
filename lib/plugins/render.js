'use strict';

/**
 * Module dependencies.
 */

var through = require('through2');
var gutil = require('gulp-util');
var path = require('path');
var _ = require('lodash');

/**
 * Assemble renderer plugin used to render templates passed through the stream.
 *
 * @param  {Object} `options` Additional options to use.
 * @param  {Object} `locals` Additional locals to pass to the renderer.
 * @return {Stream} Stream compatible with Assemble pipelines
 */

module.exports = function rendererPlugin(options, locals) {

  var assemble = this;
  var session = assemble.session;
  var opts = _.extend({}, this.options, options);

  // get the custom template type created for this task
  var taskName = session.get('task name');
  var templateType = 'page';
  var buildKey = assemble.option('renameKey') || function (fp) {
    return path.basename(fp, path.extname(fp));
  };

  // create a custom template type based on the task name to keep
  // source templates separate.
  if (taskName) {
    templateType = '__task__' + taskName;
    buildKey = function (fp) {
      return path.basename(fp, path.extname(fp));
    };
  }

  var plural = assemble.collection[templateType];
  var renderables = session.get('renderables') || [];
  renderables = renderables.concat([plural]).filter(Boolean);

  /**
   * Actual renderer plugin used in a pipeline.
   *
   * @param  {Object} `file` Vinyl File Object from the current stream.
   * @param  {Object} `enc` `file.contents` encoding.
   * @param  {Function} `cb` Callback to indicate when the transform function is complete.
   */

  return through.obj(function(file, encoding, cb) {
    if (file.isNull()) {
      this.push(file);
      return cb();
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('assemble-plugin:render', 'Streaming is not supported.'));
      return cb();
    }

    try {
      // find the template associated with the vinyl file
      var stream = this;
      var key = buildKey(file.path);
      var template = renderables.map(function(type) {
        return assemble.views[type][key];
      }).filter(Boolean);

      template = template.length === 0 ? assemble.views.pages[key] : template[0];
      if (!template) {
        stream.push(file);
        return cb();
      }

      // update the template information with any changes that might not have
      // been updated by reference while running through the stream
      template.content = file.contents.toString();

      // render the template template with the given locals
      template.render(locals, function(err, content) {
        if (err) {
          stream.emit('error', new gutil.PluginError('assemble-plugin:render', err));
          cb(err);
          return;
        }

        // update the vinyl file with the rendered contents
        // and push back into the stream.
        file.contents = new Buffer(content);
        stream.push(file);
        cb();
      });

    } catch (err) {
      this.emit('error', new gutil.PluginError('assemble-plugin:render', err));
      return cb();
    }
  });
};
