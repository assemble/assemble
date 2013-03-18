/* ==========================================================
 * lib/utils/engineLoader.js
 * 
 * Assemble
 * http://assemble.io
 *
 * Copyright (c) 2012 Upstage
 * Licensed under the MIT license.
 * https://github.com/assemble/assemble/blob/master/LICENSE-MIT
 * ========================================================== */

(function(exports) {

  var fs                 = require('fs'),
      path               = require('path'),
      _                  = require('lodash'),
      extensions         = require('../config/extensionMap'),
      commonPreprocessor = require('./common-preprocessors');

  var EngineLoader = function(options) {
    this.init(options);
  };

  EngineLoader.prototype.init = function(options) {

    var defaults = {
      engine: 'handlebars',
      helpers: '../engines/handlebars/helpers/defaultHelpers.js',
      preprocessors: false
    };
    this.options = _.extend(defaults, options);

    this.preprocessors = [];
    return this;

  };

  EngineLoader.prototype.getEngine = function(callback) {

    if(!callback) {
      callback = function(err, results) { };
    }

    if(!this.options.engine) {
      var err = 'No compatible engine available';
      callback(err, null);
      return err;
    }

    var that = this;
    var engine = {

      engine: require(this.options.engine),

      compile: function(content, options) {
        //return this.engine.compile(content, options);
        return that.preprocessors[0].compile(content, options);
      },

      render: function(template, context, options) {
        return template(context, options);
      }

    };

    this.loadHelpers(engine.engine);
    this.loadPreProcessors(engine.engine);

    callback(null, engine);
    return engine;

  };

  EngineLoader.prototype.loadHelpers = function(engine) {

    if(this.options.helpers) {

      // find helpers for the engine and load them
      if(toString.call(this.options.helpers) !== '[object Array]') {
        this.options.helpers = [this.options.helpers];
      }

      for(var i=0; i < this.options.helpers.length; i++) {
        this.requireHelper(this.options.helpers[i]).register(engine);
      }

    }

  };

  EngineLoader.prototype.loadPreProcessors = function(engine) {

    // always load the common preprocessor
    this.preprocessors.push(commonPreprocessor.init(engine));

    if(this.options.preprocessors) {

      // find pre-processors for the engine and load them
      if(toString.call(this.options.preprocessors) !== '[object Array]') {
        this.options.preprocessors = [this.options.preprocessors];
      }

      for(var i=0; i < this.options.preprocessors.length; i++) {
        this.preprocessors.push(this.requirePreprocessor(this.options.preprocessors[i]).init(engine));
      }

    }

  };

  EngineLoader.prototype.getPreprocessor = function(name) {
    for(var i=0; i < this.preprocessors.length; i++) {
      var preprocessor = this.preprocessors[i].getPreprocessor(name);
      if(preprocessor) {
        return preprocessor;
      }
    }
    return null;
  };

  EngineLoader.prototype.requireHelper = function(name) {

    var helper = false;
    var fullPath = '';

    // try from local path
    fullPath = path.resolve(process.cwd() + '/' + name);
    helper = this.require(fullPath);
    if(helper) { return helper; }
    else { helper = false; fullPath = ''; }


    // try from assemble library in node_modules
    fullPath = path.resolve('node_modules/assemble/lib/engines/' + this.options.engine + '/helpers/' + name);
    helper = this.require(fullPath);
    if(helper) { return helper; }
    else { helper = false; fullPath = ''; }


    // try from assemble library
    fullPath = path.resolve('lib/engines/' + this.options.engine + '/helpers/' + name);
    helper = this.require(fullPath);
    if(helper) { return helper; }
    else { helper = false; fullPath = ''; }


    // try from node_modules
    fullPath = name;
    helper = this.require(fullPath);
    if(helper) { return helper; }
    else { helper = false; fullPath = ''; }

    return null;

  };

  EngineLoader.prototype.requirePreprocessor = function(name) {

    var preprocessor = false;
    var fullPath = '';

    // try from local path
    fullPath = path.resolve(process.cwd() + '/' + name);
    preprocessor = this.require(fullPath);
    if(preprocessor) { return preprocessor; }
    else { preprocessor = false; fullPath = ''; }


    // try from assemble library in node_modules
    fullPath = path.resolve('node_modules/assemble/lib/engines/' + this.options.engine + '/preprocessors/' + name);
    preprocessor = this.require(fullPath);
    if(preprocessor) { return preprocessor; }
    else { preprocessor = false; fullPath = ''; }


    // try from assemble library
    fullPath = path.resolve('lib/engines/' + this.options.engine + '/preprocessors/' + name);
    preprocessor = this.require(fullPath);
    if(preprocessor) { return preprocessor; }
    else { preprocessor = false; fullPath = ''; }


    // try from node_modules
    fullPath = name;
    preprocessor = this.require(fullPath);
    if(preprocessor) { return preprocessor; }
    else { preprocessor = false; fullPath = ''; }

  };

  EngineLoader.prototype.require = function(name) {
    try {
      var lib = require(name);
      if(lib) {
        return lib;
      }
    } catch(err) { }
    return null;
  };

  exports.EngineLoader = function(options) {
    return new EngineLoader(options);
  };

}(typeof exports === 'object' && exports || this));
