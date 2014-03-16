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
var utils = require('./utils').utils;


var engine = module.exports.engine = {};

var Engine = function (assemble, type, options) {
  this.assemble = assemble;
  this.type = type;
  this.options = options || {};

  engine[this.type] = require(path.join(__dirname, 'engines', this.type));
  this.renderer = engine[this.type](this.assemble, this.options);
  this.handlesLayouts = this.renderer.handlesLayouts;
};

Engine.prototype.registerPartials = function (partials, done) {
  var logger = this.assemble.log;
  async.each(_.keys(partials), function (key, next) {
      var partial = partials[key];
      utils.expandComponent(partial);
      logger.verbose('Registering Partial: ');
      logger.verbose('\t', partial.name);
      this.renderer.registerPartial(partial.name, partial.content, next);
      logger.verbose('\tfinished.');
    }.bind(this),
    function (err) {
      if (err) {
        console.log('Error', err);
      }
      done(err);
    });
};

Engine.prototype.registerHelpers =
Engine.prototype.registerFunctions = function(helpers, done) {
  var logger = this.assemble.log;
  var helperWrapper = function (key, fn) {
    return function () {
      logger.verbose('Calling Helper: ');
      logger.verbose('\t', key);
      var results = fn.apply(this, [].slice.call(arguments));
      logger.verbose('\tfinished.');
      return results;
    };
  };

  async.each(_.keys(helpers), function (key, next) {
      var helper = helpers[key];
      logger.verbose('Registering Helper: ');
      logger.verbose('\t', key);
      this.renderer.registerHelper(key, helperWrapper(key, helper), next);
      logger.verbose('\tfinished.');
    }.bind(this),
    function (err) {
      if (err) {
        console.log('Error', err);
      }
      done(err);
    });
};

Engine.prototype.renderComponents = function (components, done) {
  var logger = this.assemble.log;
  async.each(_.keys(components), function (key, next) {
      var component = components[key];
      logger.verbose('Rendering Component: ');
      logger.verbose('\t', key);
      this.render(component.content, component.metadata, {}, function (err, content) {
        logger.verbose('\tfinished.');
        component.rendered = content;
        next();
      });
    }.bind(this),
    done);
};

Engine.prototype.compile = function (tmpl, options, done) {
  var logger = this.assemble.log;
  logger.verbose('Compiling template: ');
  logger.verbose('\t', tmpl);
  this.renderer.compile(tmpl, options, function () {
    logger.verbose('\tfinished.');
    done.apply(this, [].slice.call(arguments));
  });
};

Engine.prototype.render = function (tmpl, data, options, done) {
  var logger = this.assemble.log;
  logger.verbose('Rendering: ');
  logger.verbose('\ttemplate: ', tmpl);
  logger.verbose('\tdata: ', data);
  this.renderer.render(tmpl, data, options, function () {
    logger.verbose('\t.finished.');
    done.apply(this, [].slice.call(arguments));
  });
};

Engine.prototype.loadDefaultLayout = function(done) {
  var logger = this.assemble.log;
  logger.verbose('Loading default layout: ');
  this.renderer.loadDefaultLayout(function () {
    logger.verbose('\t.finished.');
    done.apply(this, [].slice.call(arguments));
  });
};

Engine.prototype.loadComponentLayout = function(component, done) {
  var logger = this.assemble.log;
  logger.verbose('Loading component layout: ');
  this.renderer.loadComponentLayout(component, function () {
    logger.verbose('\t.finished.');
    done.apply(this, [].slice.call(arguments));
  });
};


engine.get = function (assemble, type, options) {
  return new Engine(assemble, type, options);
};