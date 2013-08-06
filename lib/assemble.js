/*
 * Assemble
 * https://github.com/assemble/
 *
 * Copyright (c) 2013 Upstage
 * Licensed under the MIT license.
 */

// NPM Libs
var _ = require('lodash');

var Assemble = function() {

  var dataUtils = require('./data');
  var engineUtils = require('./engine');
  var utils = require('./util');
  var steps = [];

  var init = function(task, grunt){

    this.grunt = grunt;
    this.task = task;
    this.options = task.options({
      layout: '',
      partials: [],
      data: [],
      assets: '',
      ext: '.html'
    });

    this.options.data = mergeOptionsArrays.apply(this, [task.target, 'data']);
    this.options.partials = mergeOptionsArrays.apply(this, [task.target, 'partials']);
    this.options.collections = mergeOptionsArrays.apply(this, [task.target, 'collections']);

    // add default collections
    this.options.collections = _.union(this.options.collections, ['tags', 'categories', { name: 'pages' }]);

    this.options.collections = utils.collection.normalize(this.options.collections);

    // if there is a pages property and it's an array, turn it into an object
    if(this.options.pages && grunt.util.kindOf(this.options.pages) === 'array') {
      var pages = {};
      _.forEach(this.options.pages, function(page) {
        if(page.filename && page.filename.length > 0) {
          pages[page.filename] = page;
        }
      });
      this.options.pages = _.cloneDeep(pages);
    }

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
    return _.union([], globalArray, targetArray);
  };

  return {
    init: init,
    step: step,
    build: build,

    data: dataUtils,
    engine: engineUtils,
    util: utils
  };

};

module.exports = exports = new Assemble();
