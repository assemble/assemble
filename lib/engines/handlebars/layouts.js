/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
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

var processOptions = function (assemble) {
  var omitted = _.omit(assemble.config, ['grunt', 'orig', 'components']);
  var processed = assemble.utils.data.process(omitted, assemble.config, { imports: { grunt: assemble.config.grunt } });
  assemble.config = _.merge({}, assemble.config, processed);
};

var processMetadata = function (assemble, data) {
  var omitted =_.omit(assemble.config, ['grunt', 'orig', 'components']);
  var merged = _.merge({}, omitted, assemble.data, data);
  return assemble.utils.data.process(data, merged, { imports: { grunt: assemble.config.grunt } });
};

/**
 * Load the default layout and assign it to a property on the assemble object
 * @param  {[type]}   assemble [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
layoutHandler.loadDefaultLayout = function (assemble, callback) {
  // make sure to process the assemble.config before loading the layout
  processOptions(assemble);
  layoutHandler.loadLayout(assemble, assemble.config.layout, function (err, layout) {
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
      // expand the component data to ensure the layout information is correct
      if (component.data) {
        component.data = processMetadata(assemble, component.data);
      }
      if (component.data && (component.data.layout || component.data.layout === false || component.data.layout === 'none')) {
        layoutHandler.loadLayout(assemble, component.data.layout, function (err, results) {
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
    component.data = _.merge({}, layout.data, component.data);
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

  // process assemble.config before loading layout to make sure any options are resolved.
  processOptions(assemble);

  var layoutext = assemble.config.layoutext || '';
  var layout = '';
  var layoutdir = assemble.config.layoutdir || assemble.config.layouts || '';

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
      layout = assemble.utils.component.fromFile(layout, 'layout');
      layout.name = layoutName;
      layout.content = layout.content.replace(/\{{>\s*body\s*}}/g, defaultLayout);
      layoutStack.push(layout);

      // process file data
      if (layout && layout.data) {
        layout.data = processMetadata(assemble, layout.data);
      }

      if (layout && layout.data && (layout.data.layout || layout.data.layout === false || layout.data.layout === 'none' || layout.data.layout === 'nil')) {
        return load(layout.data.layout, done);
      }
      return done();

    } else {
      var tmp = layout;
      layout = new assemble.models.Component();
      layout.name = 'layout';
      layout.content = tmp;
      layout.data = {};

      layoutStack.push(layout);

      if (layout & layout.data && (layout.data.layout || layout.data.layout === false || layout.data.layout === 'none' || layout.data.layout === 'nil')) {
        return load(layout.data.layout, done);
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
    finalResults.data = {};

    while (layout = layoutStack.pop()) {
      finalResults.content = injectBody(finalResults.content, layout.content);
      finalResults.data = _.merge({}, finalResults.data, layout.data);
      finalResults.name = layout.name;
    }

    return callback(null, finalResults);
  });
};
