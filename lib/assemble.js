/*
 * Assemble
 * https://github.com/assemble/
 *
 * Copyright (c) 2013 Upstage
 * Licensed under the MIT license.
 */


(function(exports) {

  // NPM Libs
  var _ = require('lodash');
  var grunt = require('grunt');

  // Assemble Libs
  var utils = require('assemble-utils');
  exports.Utils = utils;

  exports.init = function(task){
    return new Assemble(task);
  };

  // exports.FrontMatter = function(options) {
  //   return utils.FrontMatter(options);
  // };

  // exports.Markdown = function(options) {
  //   return utils.Markdown(options);
  // };

  // exports.EngineLoader = function(options) {
  //   return utils.EngineLoader(options);
  // };

  var Assemble = function(task){
    return this.init(task);
  };

  Assemble.prototype.init = function(task){
    this.task = task;
    this.steps = [];

    this.options = task.options({
      layout: '',
      partials: [],
      data: [],
      assets: 'dist/assets',
      ext: '.html'
    });

    this.options.data = this.mergeOptionsArrays(task.target, 'data');
    this.options.partials = this.mergeOptionsArrays(task.target, 'partials');

    this.files = task.files;

    return this;
  };

  Assemble.prototype.step = function(fn) {
    this.steps.push(fn);
    return this;
  };

  Assemble.prototype.build = function(callback) {
    var self = this;
    if(this.steps.length === 0) {
      if(callback) {
        callback(null, true);
      }
      return true;
    }

    var step = 0, totalSteps = this.steps.length;
    this.steps[step++](self, function next(assemble) {
      if(step < totalSteps) {
        self.steps[step++](self, next);
      } else {
        if(callback) {
          callback(null, true);
        }
        return true;
      }
    });
  };

  Assemble.prototype.mergeOptionsArrays = function(target, name) {
    var globalArray = grunt.config(['assemble', 'options', name]) || [];
    var targetArray = grunt.config(['assemble', target, 'options', name]) || [];
    return _.union(globalArray, targetArray);
  };

}(typeof exports === 'object' && exports || this));
