/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

'use strict';

// node_modules
var async = require('async');
var path = require('path');
var _ = require('lodash');

// local libs
var utils = require('./utils');


var engine = module.exports.engine = {};

var Engine = function (assemble, type, options) {
  this.assemble = assemble;
  this.type = type;
  this.options = options || {};

  engine[this.type] = require(path.join(__dirname, 'engines', this.type));
  this.renderer = engine[this.type](this.assemble, this.options);
  this.handlesLayouts = this.renderer.handlesLayouts;
};

Engine.prototype.init = function (done) {
  if (_.isFunction (this.renderer.init)) {
    return this.renderer.init(done);
  }
  return done();
};

Engine.prototype.registerPartials = function (partials, done) {
  var logger = this.assemble.log;
  async.each(_.keys(partials), function (key, next) {
      var partial = partials[key];
      utils.component.expand(partial);
      logger.verbose('\t[partial]:', 'registering\t', partial.name);

      this.renderer.registerPartial(partial.name, partial.content, next);
      logger.verbose('\t[done]');

    }.bind(this),
    function (err) {
      if (err) {
        console.log('\t[error]:', err);
      }
      done(err);
    });
};

Engine.prototype.registerHelpers =
Engine.prototype.registerFunctions = function(helpers, done) {
  var logger = this.assemble.log;
  var helperWrapper = function (key, fn) {
    return function () {
      logger.verbose('\t[helpers]:', 'calling:');
      logger.verbose('\t', key);
      var results = fn.apply(this, [].slice.call(arguments));
      logger.verbose('\t[done]');
      return results;
    };
  };

  async.each(_.keys(helpers), function (key, next) {
      var helper = helpers[key];
      logger.verbose('\t[helpers]:', 'registering:');
      logger.verbose('\t', key);
      this.renderer.registerHelper(key, helperWrapper(key, helper), next);
      logger.verbose('\t[done]');
    }.bind(this),
    function (err) {
      if (err) {
        console.log('\t[error]:', err);
      }
      if (done && _.isFunction(done)) {
        return done(err);
      }
    });
};

Engine.prototype.registerComponents = function (components, done) {
  if (_.isFunction(this.renderer.registerComponents)) {
    return this.renderer.registerComponents(components, done);
  }
  return done();
};

Engine.prototype.renderComponents = function (components, done) {
  var logger = this.assemble.log;
  async.each(_.keys(components), function (key, next) {
      var component = components[key];
      logger.verbost('\t[component]:', 'rendering', key);

      this.render(component.content, component.data, {}, function (err, content) {
        logger.verbose('\t[done]');
        component.rendered = content;
        next();
      });
    }.bind(this),
    done);
};

Engine.prototype.compile = function (tmpl, options, done) {
  var logger = this.assemble.log;
  logger.verbose('\t[templates]:', 'compiling', tmpl);

  this.renderer.compile(tmpl, options, function () {
    logger.verbose('\t[done]');
    done.apply(this, [].slice.call(arguments));
  });
};

Engine.prototype.render = function (tmpl, data, options, done) {
  var logger = this.assemble.log;
  logger.verbose('\t[template]:', 'rendering', tmpl);
  logger.verbose('\t[data]:', 'rendering', data);

  this.renderer.render(tmpl, data, options, function () {
    logger.verbose('\t[done]');
    done.apply(this, [].slice.call(arguments));
  });
};

Engine.prototype.loadDefaultLayout = function(done) {
  var logger = this.assemble.log;
  logger.verbose('\t[loading]:', 'default layout:');

  this.renderer.loadDefaultLayout(function () {
    logger.verbose('\t[done]');
    done.apply(this, [].slice.call(arguments));
  });
};

Engine.prototype.loadComponentLayout = function(component, done) {
  var logger = this.assemble.log;
  logger.verbose('\t[loading]:', 'component layout:');

  this.renderer.loadComponentLayout(component, function () {
    logger.verbose('\t[done]');
    done.apply(this, [].slice.call(arguments));
  });
};


engine.get = function (assemble, type, options) {
  return new Engine(assemble, type, options);
};
