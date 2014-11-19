'use strict';

/**
 * Module dependencies.
 */

var tutils = require('template-utils');
var session = require('../session');
var through = require('through2');
var gutil = require('gulp-util');
var utils = require('../utils');
var path = require('path');
var _ = require('lodash');

/**
 * Assemble init plugin used to add files from a source to the template cache.
 *
 * @param  {Object} `options` Additional options to use.
 * @return {Stream} Stream compatible with Assemble pipelines
 */

module.exports = function initPlugin(options) {

  var assemble = this;
  var opts = _.extend({}, this.options, options);

  /**
   * Custom file loader for custom template type.
   * Loader generates a key based on the `file.path` and pushs the object through.
   *
   * @param  {Object} `file` File object to add to the template cache/
   * @param  {Function} `next` Callback function to indicate when the loader is finished.
   */

  var loader = function (file, next) {
    var key = path.basename(file.path, path.extname(file.path));
    var obj = {};
    obj[key] = file;
    next(null, obj);
  };

  var taskName = session.get('task name');
  var fileType = 'page';

  // create a custom template type based on the task name to keep
  // source files separate.
  if (taskName) {
    fileType = '__task__' + taskName;
    session.set('file type', fileType);
    assemble.create(fileType, { isRenderable: true }, [loader]);
  }
  var plural = assemble.collection[fileType];

  /**
   * Actual init plugin used in a pipeline.
   *
   * @param  {Object} `record` Vinyl File Object from `assemble.src`
   * @param  {Object} `enc` `record.contents` encoding.
   * @param  {Function} `cb` Callback to indicate when the transform function is complete.
   */

  return through.obj(function (record, enc, cb) {

    if (record.isStream()) {
      var err = new gutil.PluginError('assemble-plugin:init', 'Streaming is not supported.');
      this.emit('error', err);
      return cb();
    }

    // Convert vinyl record into an assemble file.
    var file = tutils.toTemplate(record);

    // Add files to template cache
    assemble[fileType](file, cb);
  }, function (cb) {
    // push all the templates on the current fileType cache into the stream
    // this lets other plugins do processing on the templates before rendering.
    var stream = this;
    utils.stream.pushToStream(assemble.views[plural], stream);

    // if the current filetype is not `page` (e.g. dynamically created)
    // push the pages collection through the stream
    if (fileType !== 'page') {
      utils.stream.pushToStream(assemble.views.pages, stream);
    }

    cb();
  });
};
