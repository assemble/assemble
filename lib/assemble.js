/*
 * Assemble
 * https://github.com/assemble/
 *
 * Copyright (c) 2013 Upstage
 * Licensed under the MIT license.
 */

// NPM Libs
var _ = require('lodash');
var grunt = require('grunt');

var Assemble = function() {

  var dataUtils = require('./data');
  var engineUtils = require('./engine');
  var steps = [];

  var init = function(task){

    this.task = task;
    this.options = task.options({
      layout: '',
      partials: [],
      data: [],
      assets: 'dist/assets',
      ext: '.html'
    });

    this.options.data = mergeOptionsArrays(task.target, 'data');
    this.options.partials = mergeOptionsArrays(task.target, 'partials');

    this.files = task.files;
    steps = [];

    return this;
  };

  var step = function(fn) {
    steps.push(fn);
    return this;
  };

  var build = function(callback) {
    grunt.verbose.writeln('building');
    var self = this;
    grunt.verbose.writeln('steps: ' + steps.length);
    if(steps.length === 0) {
      if(callback) {
        callback(null, true);
      }
      return true;
    }

    var step = 0, totalSteps = steps.length;
    steps[step++](self, function next(assemble) {
      grunt.verbose.writeln('step ' + step + ' finished');
      if(step < totalSteps) {
        grunt.verbose.writeln('calling next step ' + (step + 1));
        steps[step++](self, next);
      } else {
        grunt.verbose.writeln('finished build, returning');
        if(callback) {
          callback(null, true);
        }
        return true;
      }
    });
  };

  var mergeOptionsArrays = function(target, name) {
    var globalArray = grunt.config(['assemble', 'options', name]) || [];
    var targetArray = grunt.config(['assemble', target, 'options', name]) || [];
    return _.union(globalArray, targetArray);
  };

  return {
    init: init,
    step: step,
    build: build,

    data: dataUtils,
    engine: engineUtils
  };

};

module.exports = exports = new Assemble();
