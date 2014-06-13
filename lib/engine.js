/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */
'use strict';


var grunt   = require('grunt');
var helpers = require('./helpers');


var EngineFactory = function() {

  var engineName = '';


  var tryRequireEngine = function(eng, obj) {
    try {
      obj.engine = require('assemble-' + eng);
    } catch(e) {
      try {
        obj.engine = require(eng);
      } catch(err) {
        grunt.log.writeln('Error loading engine: ' + eng);
        grunt.log.writeln(err);
        grunt.log.writeln('Run `npm install assemble-' + eng + '` to use ' + eng);
      }
    }
  };

  var load = function(eng) {
    engineName = eng;
    tryRequireEngine(eng, this);
    if(!this.engine) {
      return false;
    }

    // set some defaults
    this.startDelimiter = this.engine.startDelimiter || '{{';
    this.endDelimiter = this.engine.endDelimiter || '}}';

    var search = this.startDelimiter + "\\s*body\\s*" + this.endDelimiter;
    this.bodyRegex = new RegExp(search, 'i');
    return this;
  };


  var init = function(options, params) {
    if(typeof this.engine.init === 'function') {
      this.engine.init(options, params);
    }
    if(options && typeof options.helpers !== 'undefined') {
      if(!Array.isArray(options.helpers)){
        options.helpers = [options.helpers];
      }
      var engineInstance = this.engine[engineName] || this.engine;
      options.helpers.forEach(function(patterns) {
        helpers.register(patterns, this.engine, engineInstance, options, params);
      }, this);
    }
  };

  var compile = function(src, options, callback) {
    if(typeof this.engine.compile !== 'function') {
      grunt.log.writeln(engineName, 'does not support compile.');
      callback(engineName + ' does not support compile.', null);
    }
    this.engine.compile(src, options, callback);
  };

  var render = function(tmpl, options, callback) {
    if(typeof this.engine.render !== 'function') {
      grunt.log.writeln(engineName, 'does not support render.');
      callback(engineName + ' does not support render.', null);
    }
    this.engine.render(tmpl, options, callback);
  };

  // Helpers, filters etc. depending on template engine
  var registerFunctions = function(helperFunctions) {
    if(typeof this.engine.registerFunctions === 'function') {
      this.engine.registerFunctions(helperFunctions);
    }
  };

  var registerPartial = function(filename, content) {
    if(typeof this.engine.registerPartial === 'function') {
      this.engine.registerPartial(filename, content);
    }
  };

  return {
    load: load,
    init: init,
    compile: compile,
    render: render,
    registerFunctions: registerFunctions,
    registerPartial: registerPartial
  };

};

module.exports = exports = new EngineFactory();
