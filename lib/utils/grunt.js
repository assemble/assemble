/**
 * Assemble
 *
 * Assemble <http://assemble.io>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2013 Upstage.
 * Licensed under the MIT License (MIT).
 */

var _ = require('lodash');

var g = module.exports = {};

g.mapFiles = function(task, grunt) {
  grunt = grunt || require('grunt');
	return task.files;
};

/**
 * Given a grunt task, return the options
 * 
 * @param  {Object} task - grunt.task
 * @return {Object}
 */
g.mapData = function(task, defaults, grunt) {
  defaults = defaults || {};
  grunt = grunt || require('grunt');
  var options = task.options(defaults);
  
  // merge task and target arrays together
  options = _.mapValues(options, function(value, key) {
    if(_.isArray(value)) {
      return g.mergeOptions(key, grunt);
    }
    return value;
  });

	return options;
};

/**
 * Merge options at the task and target levels. Normal
 * behavior is for target-level options to overwrite
 * task-level options.
 */
g.mergeOptions = function(name, grunt) {
  grunt = grunt || require('grunt');
  var task = grunt.task.current;
  var taskArray = grunt.config([task.name, 'options', name]) || [];
  var targetArray = grunt.config([task.name, task.target, 'options', name]) || [];
  return _.union(taskArray, targetArray);
};