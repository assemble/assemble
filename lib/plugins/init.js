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
 * Assemble init plugin used to add templates from a source to the template cache.
 *
 * @param  {Object} `options` Additional options to use.
 * @return {Stream} Stream compatible with Assemble pipelines
 */

module.exports = function initPlugin(options) {

  var assemble = this;
  var opts = _.extend({}, this.options, options);

  /**
   * Custom template loader for custom template type.
   * Loader generates a key based on the `template.path` and pushs the object through.
   *
   * @param  {Object} `template` File object to add to the template cache/
   * @param  {Function} `next` Callback function to indicate when the loader is finished.
   */

  var loader = function (template) {
    var key = path.basename(template.path, path.extname(template.path));
    var obj = {};
    obj[key] = template;
    return obj;
  };

  var taskName = session.get('task name');
  var templateType = 'page';

  // create a custom template type based on the task name to keep
  // source templates separate.
  if (taskName) {
    templateType = '__task__' + taskName;
    session.set('template type', templateType);
    assemble.create(templateType, { isRenderable: true }, [loader]);
  }
  var plural = assemble.collection[templateType];

  /**
   * Actual init plugin used in a pipeline.
   *
   * @param  {Object} `file` Vinyl File Object from `assemble.src`
   * @param  {Object} `enc` `file.contents` encoding.
   * @param  {Function} `cb` Callback to indicate when the transform function is complete.
   */

  return through.obj(function (file, enc, cb) {

    if (file.isStream()) {
      var err = new gutil.PluginError('assemble-plugin:init', 'Streaming is not supported.');
      this.emit('error', err);
      return cb();
    }

    // Convert vinyl file into an assemble template.
    var template = tutils.toTemplate(file);

    // Add templates to template cache
    assemble[templateType](template);

    // let the stream know we're done
    cb();
  }, function (cb) {
    // push all the templates on the current templateType cache into the stream
    // this lets other plugins do processing on the templates before rendering.
    var stream = this;
    utils.stream.pushToStream(assemble.views[plural], stream);

    // if the current templatetype is not `page` (e.g. dynamically created)
    // push the pages collection through the stream
    if (templateType !== 'page') {
      utils.stream.pushToStream(assemble.views.pages, stream);
    }

    cb();
  });
};
