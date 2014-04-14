/**
 * Assemble
 *
 * Assemble <http://assemble.io>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2014 Assemble.
 * Licensed under the MIT License (MIT).
 */

// Node.js
var inspect = require('util').inspect;
var path = require('path');

// node_modules
var file = require('fs-utils');
var async = require('async');
var relative = require('relative');
var _ = require('lodash');


var layoutHandler = module.exports = {};

var injectBody = function (layout, body) {
  return layout.replace(/\{{\s*body\s*}}/g, body);
};

/**
 * Load the default layout and assign it to a property on the assemble object
 * @param  {[type]}   assemble [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
layoutHandler.loadDefaultLayout = function (assemble, callback) {
  layoutHandler.loadLayout(assemble, assemble.options.layout, function (err, layout) {
    if (err) {
      return callback(err);
    }
    assemble.defaultLayout = layout;
    assemble.log.debug(inspect(assemble.defaultLayout));
    return callback();
  });
};

/**
 * Load the specific layout for a component to be used at render time
 * @param  {[type]}   assemble  [description]
 * @param  {[type]}   component [description]
 * @param  {Function} callback  [description]
 * @return {[type]}             [description]
 */
layoutHandler.loadComponentLayout = function (assemble, component, callback) {
  var layout = _.cloneDeep(assemble.defaultLayout);

  async.series([
    function (next) {
      // expand the component metadata to ensure the layout information is correct
      if (component.metadata) {
        component.metadata = assemble.utils.data.process(component.metadata, _.merge({}, assemble.options, assemble.data, component.metadata));
      }
      if (component.metadata && (component.metadata.layout || component.metadata.layout === false || component.metadata.layout === 'none')) {
        layoutHandler.loadLayout(assemble, component.metadata.layout, function (err, results) {
          if (err) {
            return next(err);
          }
          layout = results;
          return next();
        });
      } else {
        return next();
      }
    }
  ],
  function (err) {
    if (err) {
      return callback(err);
    }
    component.metadata = _.merge({}, layout.metadata, component.metadata);
    component.content = injectBody(layout.content, component.content);

    assemble.log.debug('final component', inspect(component));
    return callback();
  });
};

/**
 * Given a source path, load a layout file with nesting
 * @param  {[type]}   assemble [description]
 * @param  {[type]}   src      [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
layoutHandler.loadLayout = function (assemble, src, callback) {

  var layoutStack = [];
  var layoutName = 'default';
  var defaultLayout = '{{body}}';

  // process assemble.options before loading layout to make sure any options are resolved.
  assemble.options = assemble.utils.data.process(assemble.options);

  var layoutext = assemble.options.layoutext || '';
  var layout = '';
  var layoutdir = assemble.options.layoutdir || assemble.options.layouts || '';

  var load = function (src, done) {
    var loadFile = true;

    // if the src is empty, create a default layout in memory
    if (!src || src === false || src === 'none' || src === 'nil' || src === '' || src.length === 0) {
      loadFile = false;
      layout = defaultLayout;
    }


    if (loadFile) {
      assemble.log.debug('[layout src]:', src);
      layout = relative(path.join(layoutdir, src + layoutext));
      assemble.log.debug('[layout path]:', layout);

      if (!file.exists(layout)) {
        var err = '[layout file]: (' + layout + ') not found.';
        return done(new Error(err));
      }

      layoutName = file.basename(layout);
      layout = assemble.models.Component.readFile(layout, 'layout');
      layout.name = layoutName;
      layout.content = layout.content.replace(/\{{>\s*body\s*}}/g, defaultLayout);
      layoutStack.push(layout);

      // process file metadata
      if (layout && layout.metadata) {
        layout.metadata = assemble.utils.data.process(layout.metadata, _.merge({}, assemble.options, assemble.data, layout.metadata));
      }

      if (layout && layout.metadata && (layout.metadata.layout || layout.metadata.layout === false || layout.metadata.layout === 'none')) {
        return load(layout.metadata.layout, done);
      }
      return done();

    } else {
      var tmp = layout;
      layout = new assemble.models.Component();
      layout.name = 'layout';
      layout.content = tmp;
      layout.metadata = {};

      layoutStack.push(layout);

      if (layout & layout.metadata && (layout.metadata.layout || layout.metadata.layout === false || layout.metadata.layout === 'none')) {
        return load(layout.metadata.layout, done);
      }
      return done();
    }
  };

  load(src, function (err) {
    if (err) {
      assemble.log.error(err);
      return callback(err);
    }

    var finalResults = new assemble.models.Component();
    finalResults.name = '';
    finalResults.content = defaultLayout;
    finalResults.metadata = {};

    while (layout = layoutStack.pop()) {
      finalResults.content = injectBody(finalResults.content, layout.content);
      finalResults.metadata = _.merge({}, finalResults.metadata, layout.metadata);
      finalResults.name = layout.name;
    }

    return callback(null, finalResults);
  });
};
