/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

'use strict';

// node.js
var events = require('events');
var path = require('path');

// node modules
var file = require('fs-utils');
var relative = require('relative');
var plasma = require('plasma');

var _ = require('lodash');
_.str = require('underscore.string');

var Dovetail = require('dovetail');
var async = require('async');


/**
 * Main Class for  Assemble.
 * @param {[type]} options options
 */

var Assemble = function (src, options) {
  if ((this instanceof Assemble) === false) {
    return new Assemble(src, options);
  }
  events.EventEmitter.call(this);

  if (_.isPlainObject(src)) {
    options = src;
    src = undefined;
  }
  options = options || {};
  options.src = options.src || src;

  // provide a way to access assemble by name in the plugins
  this.appName = 'assemble';

  // add assemble "static" objects
  this.config   = Assemble.config;
  this.defaults = Assemble.defaults;
  this.models   = Assemble.models;
  this.render   = Assemble.render;
  this.utils    = Assemble.utils;
  this.paths    = Assemble.paths;

  // try to find an assemblerc file
  var runtimeConfig = {};
  if (options.assemblerc) {
    runtimeConfig = file.readDataSync(options.assemblerc);
  }

  this.src = options.src;

  var omissions = _.omit(this.defaults, ['plugins', 'middleware']);
  this.options = _.merge({}, omissions, options || {}, runtimeConfig || {});

  // Clone the options so they can be accessed through the api
  this.options.orig = _.cloneDeep(this.options);

  this.log = Assemble.logger(this.options.log || {});
  this.dovetail = new Dovetail(this, this.log);

  this.options.plugins = _.union(Assemble.defaults.plugins, this.options.plugins);
  this.plugins = this.dovetail.resolve(this.options.plugins);

  this.middleware = [];

  // setup the context
  this.context = this.config.context.stub(this);

};
require('util').inherits(Assemble, events.EventEmitter);

Assemble.utils  = require('./utils');
Assemble.render = require('./render');
Assemble.logger = Assemble.utils.log;

var middleware = require('./middleware');
var config = Assemble.config = require('./config');
Assemble.models = require('./models');

// add assemble plugin events to Dovetail
Dovetail.plugins.addEvents(config.plugins.events);

Assemble.paths = {
  defaults: relative(path.join(__dirname, 'defaults.yml')),
  plugins: relative(path.join(__dirname, 'plugins'))
};

Assemble.defaults = _.merge({
  plugins: [
    relative(path.join(Assemble.paths.plugins, 'core-collections.js')),
    relative(path.join(Assemble.paths.plugins, 'core-paths.js')),
    relative(path.join(Assemble.paths.plugins, 'core-pagination-step1.js')),
    relative(path.join(Assemble.paths.plugins, 'core-components.js')),
    relative(path.join(Assemble.paths.plugins, 'core-pagination-step2.js'))
  ],
  // Core middleware to be loaded by dovetail
  middleware: [
    middleware.config,
    middleware.data,
    middleware.build,
    middleware.render
  ]
}, file.readDataSync(Assemble.paths.defaults));

Assemble.prototype.use = function(middleware) {
  this.middleware.push(middleware);
  return this;
};

Assemble.prototype.build = function (callback) {

  // reset the context before building
  this.context = this.config.context.stub(this);

  // loop over each middleware
  async.eachSeries(

    (this.middleware.length === 0 ? Assemble.defaults.middleware : this.middleware),

    // call each middleware
    function (middleware, next) {
      middleware(this, next);
    }.bind(this),

    // call done with the callback
    middleware.done(this, callback));

};

/**
 * Given a glob pattern, load helpers using plasma and register the results.
 * @param  {String|Array}   pattern Glob pattern pointing to helper files
 * @param  {Function}       done    Callback called when loading is finished
 */

Assemble.prototype.registerHelpers = function(pattern, done) {

  if (!this.engine) {
    return done(new Error('The rendering engine has not been configured yet. Register helpers after configuration is finished.'));
  }

  if (!_.isEmpty(pattern)) {
    var helpers = plasma.fn(pattern, {config: this});

    this.engine.registerHelpers(helpers, done);
  } else {
    done();
  }
};

/**
 * Alias of registerHelpers
  */
Assemble.prototype.registerFunctions = Assemble.prototype.registerHelpers;

module.exports = Assemble;
