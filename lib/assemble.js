'use strict';
/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

var path = require('path');
var _   = require('lodash');


/**
 * Assemble
 */

var Assemble = function() {

  var engineUtils = require('./engine');
  var collection  = require('./collection');
  var plugins  = require('./plugins');
  var utils  = require('./utils');

  var steps = [];

  var init = function(task, grunt){

    this.grunt = grunt;
    this.task = task;
    this.options = task.options({
      layoutdir: '',
      layout: '',
      layoutext: '',
      partials: [],
      data: [],
      assets: '',
      ext: '.html'
    });

    this.options.originalAssets = this.options.assets;
    this.options.originalLayout = this.options.layout;

    this.options.data = mergeOptionsArrays.apply(this, [task.target, 'data']);
    this.options.partials = mergeOptionsArrays.apply(this, [task.target, 'partials']);
    this.options.collections = mergeOptionsArrays.apply(this, [task.target, 'collections']);

    // add default collections
    collection.ensureCollection(this.options.collections, 'tags');
    collection.ensureCollection(this.options.collections, 'categories');
    collection.ensureCollection(this.options.collections, 'pages');

    this.options.collections = collection.normalize(this.options.collections);

    // if there is a pages property and it's an array, turn it into an object
    if(this.options.pages && Array.isArray(this.options.pages)) {
      var pages = {};
      _.forEach(this.options.pages, function(page) {
        if(page.filename && page.filename.length > 0) {
          pages[page.filename] = page;
        }
      });
      this.options.pages = _.cloneDeep(pages);
    }

    // add default plugins
    var corePlugins = path.relative(process.cwd(), path.join(__dirname, 'plugins/*.js'));
    this.options.plugins = _.union(utils.arrayify(this.options.plugins || []), [corePlugins]);

    // save original plugins option
    this.options._plugins = this.options.plugins;
    this.options.plugins = plugins.resolve(this.options.plugins, this.options);

    this.files = task.files;
    steps = [];

    return this;
  };

  var step = function(fn) {
    steps.push(fn);
    return this;
  };

  var build = function(callback) {
    this.grunt.verbose.writeln('Assembling');
    var self = this;
    this.grunt.verbose.writeln('Steps: ' + steps.length);
    if(steps.length === 0) {
      if(callback) {
        callback(null, true);
      }
      return true;
    }

    var step = 0, totalSteps = steps.length;
    steps[step++](self, function next(assemble) {
      assemble.grunt.verbose.writeln('\nStep ' + step + ' assembled.');
      if(step < totalSteps) {
        assemble.grunt.verbose.writeln('Calling step ' + (step + 1));
        steps[step++](self, next);
      } else {
        assemble.grunt.verbose.writeln('Build completed. Returning');
        if(callback) {
          callback(null, true);
        }
        return true;
      }
    });
  };

  var mergeOptionsArrays = function(target, name) {
    var globalArray = this.grunt.config(['assemble', 'options', name]) || [];
    var targetArray = this.grunt.config(['assemble', target, 'options', name]) || [];
    return _.flatten(utils.arrayify(globalArray).concat(utils.arrayify(targetArray)));
  };

  return {
    init: init,
    step: step,
    build: build,
    plugins: plugins,
    engine: engineUtils,
    util: collection
  };

};

module.exports = exports = new Assemble();
