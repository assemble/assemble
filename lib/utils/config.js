/**
 * Config Utils
 */

// Node.js
var path = require('path');
var fs = require('fs');

// node_modules
var grunt = require('grunt');


// The module to be exported.
var config = module.exports = {};



/**
 * Get data from config property. Will normalize
 * and get data from Objects, Arrays and Strings
 */

config.getData = function(data) {
  //
};


/**
 * Process Context
 * @param  {[type]} context [description]
 * @param  {[type]} data    [description]
 * @return {[type]}         [description]
 */

config.processContext = function(context, data) {
  grunt.config.data = _.extend({}, grunt.config.data, context, data);
  return grunt.config.process(data || context);
};


/**
 * Merge options at the task and target levels. Normal
 * behavior is for target-level options to overwrite
 * task-level options.
 */

config.mergeOptions = function(name) {
  var task = grunt.task.current;
  var taskArray = grunt.config([task.name, 'options', name]) || [];
  var targetArray = grunt.config([task.name, task.target, 'options', name]) || [];
  return _.union(taskArray, targetArray);
};