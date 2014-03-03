/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

'use strict';

// node_modules
var Hashtable = require('jshashtable');
var async = require('async');
var path = require('path');
var _ = require('lodash');


var engineCache = new Hashtable();
var engine = module.exports.engine = {};

var Engine = function (assemble, type, options) {
  this.assemble = assemble;
  this.type = type;
  this.options = options || {};

  if (!engine[this.type]) {
    engine[this.type] = require(path.join(__dirname, 'engines', this.type));  
  }
  this.renderer = engine[this.type](this.assemble, this.options);
};

Engine.prototype.registerPartials = function (partials, done) {
  async.each(_.keys(partials), function (key, next) {
      var partial = partials[key];
      this.renderer.registerPartial(partial.name, partial.content, next);
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
  async.each(_.keys(helpers), function (key, next) {
      var helper = helpers[key];
      this.renderer.registerHelper(key, helper, next);
    }.bind(this),
    function (err) {
      if (err) {
        console.log('Error', err);
      }
      done(err);
    });
};

Engine.prototype.renderComponents = function (components, done) {
  async.each(_.keys(components), function (key, next) {
      var component = components[key];
      this.render(component.content, component.metadata, {}, function (err, content) {
        component.rendered = content;
        next();
      });
    }.bind(this),
    done);
};

Engine.prototype.compile = function (tmpl, options, done) {
  this.renderer.compile(tmpl, options, done);
};

Engine.prototype.render = function (tmpl, data, options, done) {
  this.renderer.render(tmpl, data, options, done);
};

engine.get = function (assemble, type, options) {
  if (engineCache.containsKey(type) === false) {
    engineCache.put(type, new Engine(assemble, type, options));
  }
  return engineCache.get(type);
};