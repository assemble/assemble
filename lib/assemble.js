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
 * @param {[type]} config config
 */

var Assemble = function (src, config) {
  if ((this instanceof Assemble) === false) {
    return new Assemble(src, config);
  }
  events.EventEmitter.call(this);

  if (_.isPlainObject(src)) {
    config = src;
    src = undefined;
  }
  config = config || {};
  config.src = config.src || src;

  // provide a way to access assemble by name in the plugins
  this.appName = 'assemble';

  // add assemble "static" objects
  this.defaults = Assemble.defaults;
  this.models   = Assemble.models;
  this.render   = Assemble.render;
  this.utils    = Assemble.utils;
  this.paths    = Assemble.paths;

  // try to find an assemblerc file
  var runtimeConfig = {};
  if (config.assemblerc) {
    runtimeConfig = file.readDataSync(config.assemblerc);
  }

  this.src = config.src;

  var omissions = _.omit(this.defaults, ['plugins', 'core']);
  this.options = this.config = _.merge({}, omissions, config || {}, runtimeConfig || {});

  // Clone the config so they can be accessed through the api
  this.config.orig = _.cloneDeep(this.config);

  this.log = Assemble.logger(this.config.log || {});
  this.dovetail = new Dovetail(this, this.log);

  this.config.plugins = _.union(Assemble.defaults.plugins, this.config.plugins);
  this.plugins = this.dovetail.resolve(this.config.plugins);

  // setup the context
  this.context = this.utils.context.stub(this);

};
require('util').inherits(Assemble, events.EventEmitter);

Assemble.utils  = require('./utils');
Assemble.render = require('./render');
Assemble.logger = Assemble.utils.log;

var core = require('./core');
Assemble.models = require('./models');

// add assemble plugin events to Dovetail
Dovetail.plugins.addEvents(Assemble.utils.plugins.events);

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
  // Core steps
  core: [
    core.config,
    core.data,
    core.build,
    core.render
  ]
}, file.readDataSync(Assemble.paths.defaults));

Assemble.prototype.build = function (callback) {

  // reset the context before building
  this.context = this.utils.context.stub(this);

  // loop over each core step
  async.eachSeries(

    Assemble.defaults.core,

    // call each step
    function (step, next) {
      step(this, next);
    }.bind(this),

    // call done with the callback
    core.done(this, callback));

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
