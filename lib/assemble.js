/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

'use strict';

require('coffee-script');

// node.js
var events = require('events');
var path = require('path');

// node modules
var Hashtable = require('jshashtable');
var file = require('fs-utils');
var boson = require('boson');
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

var middleware = require('./middleware');
var config = assemble.config = require('./config');
var models = assemble.models = require('./models');

// add assemble plugin events to Dovetail
Dovetail.plugins.addEvents(config.plugins.events);

/**
 * Store a cache of the instances by name to
 * retrieve later. This is useful in unit testing.
 * @type {Object}
 */
assemble.instanceCache = new Hashtable();

assemble.paths = {
  defaults: path.relative(process.cwd(), __dirname) + '/defaults.yml',
  plugins: path.relative(process.cwd(), path.join(__dirname, 'plugins'))
};

assemble.defaults = _.extend({
  plugins: [
    path.join(assemble.paths.plugins, 'core-paths.js'),
    path.join(assemble.paths.plugins, 'core-pagination-step1.js'),
    path.join(assemble.paths.plugins, 'core-pagination-step2.js')
  ],
  middleware: [
    middleware.config,
    middleware.data,
    middleware.build,
    middleware.render
  ]
},
file.readDataSync(assemble.paths.defaults));

/**
 * Main Class for an Assemble App. Also assigning this to a property
 * on the assemble object so it can be used to new up
 * an instance of the App directly if wanted.
 *
 * WARNING - directly calling new assemble.App() with
 * overwrite existing metadata stored if given a name that exists
 * and will not affect/use the App object with the given name
 * from the instance cache
 *
 * @param {[type]} name    optional name of the instance - defaults to default
 * @param {[type]} options options
 */
var App = assemble.App = function (options) {
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
  this.options = _.extend(
    {},
    _.omit(this.defaults, ['plugins', 'middleware']),
    options.metadata || {}
  );

  this.options.orig = _.cloneDeep(this.options);

  this.log = assemble.logger(this.options.log || {});
  this.dovetail = new Dovetail(this, this.log);

  this.options.plugins = _.union(assemble.defaults.plugins, this.options.plugins);
  this.plugins = this.dovetail.resolve(this.options.plugins);

  this.middleware = [];

  // setup the context
  this.context = function () { };

};

require('util').inherits(App, events.EventEmitter);

/**
 * Retrieve an instance of App by the given
 * name. If one doesn't exist, create a new instance
 * and store it for later use.
 *
 * @param  {String} name    name of the instance to get or create
 * @param  {Object} options options passed into the App constructor
 * @return {Object}         an instance of App
 */
assemble.init = function (source, options) {
  if (_.isPlainObject(source)) {
    options = source;
    source = undefined;
  }

  options = options || {};
  options.source = options.source || source;

  options.new = options.new || false;
  if (source) {
    options.new = true;
  }

  var name = options.name || 'default';

  // if requesting a new instance or the cache doesn't contain the key
  if (options.new === true || assemble.instanceCache.containsKey(name) === false) {
    // create a new one and add it to the cache
    assemble.instanceCache.put(name, new App(options));
  }
  // get an existing instance
  return assemble.instanceCache.get(name);
};

App.prototype.use = function(middleware) {
  this.middleware.push(middleware);
  return this;
};

App.prototype.build = function (callback) {

  // reset the context before building
  this.context = function () { };

  // loop over each middleware
  async.eachSeries(

    (this.middleware.length === 0 ? assemble.defaults.middleware : this.middleware),

    // call each middleware
    function (middleware, next) {
      middleware(this, next);
    }.bind(this),

    // call done with the callback
    middleware.done(this, callback));

};

/**
 * Given a glob pattern, load helpers using boson and register the results.
 * @param  {String|Array}   pattern Glob pattern pointing to helper files
 * @param  {Function}       done    Callback called when loading is finished
 */
App.prototype.registerHelpers = function(pattern, done) {
  if (!this.engine) {
    return done(new Error('The rendering engine has not been configured yet. Register helpers after configuration is finished.'));
  }
  
  if (!_.isEmpty(pattern)) {
    var helpers = boson(pattern, this);
    this.engine.registerHelpers(helpers, done);
  } else {
    done();
  }
};

/**
 * Alias of registerHelpers
  */
App.prototype.registerFunctions = App.prototype.registerHelpers;
