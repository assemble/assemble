/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

'use strict';

var events = require('events');
var path = require('path');
var _ = require('lodash');

var Dovetail = require('dovetail');
var async = require('async');


/**
 * Use the main assemble method to get an instance
 * of the assemble builder. This allows us to create
 * multiple instances with it's own data so we can
 * use in unit testing. This also allows getting an
 * instance by name so we can use in other libraries
 *
 * @param  {String} source  source template to compile
 * @param  {Object} options options passed to the assemble instance when creating
 * @return {Object}         an instance of Assemble
 */
var assemble = module.exports = function (source, options) {
  return assemble.init(source, options);
};


assemble.utils = require('./utils');
assemble.render = require('./render');
assemble.logger = assemble.utils.log;

var stages = require('./stages');
var config = assemble.config = require('./config');
var models = assemble.models = require('./models');

// add assemble plugin events to Dovetail
Dovetail.plugins.addEvents(config.plugins.events);

/**
 * Store a cache of the instances by name to
 * retrieve later. This is useful in unit testing.
 * @type {Object}
 */
assemble.instanceCache = {};

assemble.paths = {
  plugins: path.relative(process.cwd(), path.join(__dirname, 'plugins')) + '/**/*.js',
};

assemble.defaults = {
  engine: 'handlebars',
  plugins: [assemble.paths.plugins],
  middleware: [
    stages.config,
    stages.data,
    stages.build,
    stages.render
  ]
};

/**
 * Main Class for Line. Also assigning this to a property
 * on the assemble object so it can be used to new up
 * an instance of Line directly if wanted.
 *
 * WARNING - directly calling new assemble.Line() with
 * overwrite existing metadata stored if given a name that exists
 * and will not affect/use the Line object with the given name
 * from the instance cache
 *
 * @param {[type]} name    optional name of the instance - defaults to default
 * @param {[type]} options options
 */
var Line = assemble.Line = function (options) {
  events.EventEmitter.call(this);

  // provide a way to access assemble by name in the plugins
  this.appName = 'assemble';

  options = options || {};

  // add assemble "static" objects
  this.config = assemble.config;
  this.defaults = assemble.defaults;
  this.models = assemble.models;
  this.render = assemble.render;
  this.utils = assemble.utils;
  this.paths = assemble.paths;

  this.name = options.name || 'default';
  this.metadata = new models.Metadata({
    name: this.name
  });

  this.source = options.source;
  this.options = options.metadata || {};
  this.options.orig = _.cloneDeep(this.options);

  this.log = assemble.logger(this.options.log || {});
  this.dovetail = new Dovetail(this, this.log);

  this.options.plugins = _.union(this.options.plugins, assemble.defaults.plugins);
  this.plugins = this.dovetail.resolve(this.options.plugins, _.omit(this.options, ['cwd']));

  this.middleware = [];

};

require('util').inherits(Line, events.EventEmitter);

/**
 * Retrieve an instance of Line by the given
 * name. If one doesn't exist, create a new instance
 * and store it for later use.
 *
 * @param  {String} name    name of the instance to get or create
 * @param  {Object} options options passed into the Line constructor
 * @return {Object}         an instance of Line
 */
assemble.init = function (source, options) {
  if (_.isPlainObject(source)) {
    options = source;
    source = undefined;
  }

  options = options || {};
  options.source = options.source || source;

  var name = options.name || 'default';
  return this.instanceCache[name] = this.instanceCache[name] || new Line(options);
};

Line.prototype.use = function(middleware) {
  this.middleware.push(middleware);
  return this;
};

Line.prototype.build = function (callback) {

  // loop over each middleware
  async.eachSeries(
    
    (this.middleware.length === 0 ? assemble.defaults.middleware : this.middleware),

    // call each middleware
    function (middleware, next) {
      middleware(this, next);
    }.bind(this),

    // call done with the callback
    stages.done(this, callback));

};

Line.prototype.registerPlugin = function (name, description, options, fn) {
  this.dovetail.createPlugin(name, description, options, fn);
};