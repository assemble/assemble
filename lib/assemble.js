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
 * @param  {String} name    name of instance to create/get - defaults to 'default'
 * @param  {Object} options options passed to the assemble instance when creating
 * @return {Object}         an instance of Assemble
 */
var assemble = module.exports = function (name, options) {
  return assemble.byName(name, options);
};


var stages = require('./stages');
var config = assemble.config = require('./config');
var utils = assemble.utils = require('./utils');
var render = assemble.render = require('./render');
var models = assemble.models = require('./models');
var logger = assemble.logger = assemble.utils.log;

// add assemble plugin stages to Dovetail
Dovetail.plugins.addStages(config.plugins.stages);

/**
 * Store a cache of the instances by name to
 * retrieve later. This is useful in unit testing.
 * @type {Object}
 */
assemble.instanceCache = {};

assemble.paths = {
  plugins: path.relative(process.cwd(), path.join(__dirname, 'plugins')) + '/**/*.js',
  helpers: path.relative(process.cwd(), path.join(__dirname, 'helpers')) + '/**/*.js'
};

assemble.defaults = {
  assets: '',
  layout: '',
  ext: '.html',
  layoutdir: '',
  layoutext: '',
  engine: 'handlebars',

  // arrays... will be unioned with passed in options
  data: [],
  pages: [],
  posts: [],
  routes: [],
  helpers: [assemble.paths.helpers],
  plugins: [assemble.paths.plugins],
  partials: [],
  components: []
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
var Line = assemble.Line = function (name, options) {
  events.EventEmitter.call(this);

  // provide a way to access assemble by name in the plugins
  this.appName = 'assemble';

  if (typeof name === 'object') {
    options = name;
    name = 'default';
  }

  // add assemble "static" objects
  this.defaults = assemble.defaults;
  this.models = assemble.models;
  this.render = assemble.render;
  this.utils = assemble.utils;
  this.paths = assemble.paths;

  this.name = name || 'default';
  this.metadata = new models.Metadata({
    name: this.name
  });

  this.options = (options && options.data || {});
  this.options.raw = _.cloneDeep(this.options);

  this.options.files = (options && options.files || []);

  this.log = assemble.logger(this.options.log || {});
  this.dovetail = new Dovetail(this, this.log);

  this.options.plugins = _.union(this.options.plugins, assemble.defaults.plugins);
  this.plugins = this.dovetail.resolve(this.options.plugins, _.omit(this.options, ['cwd']));

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
assemble.byName = function (name, options) {
  if (typeof name === 'object') {
    options = name;
    name = 'default';
  }
  name = name || 'default';
  return this.instanceCache[name] = this.instanceCache[name] || new Line(name, options);
};

Line.prototype.build = function (callback) {
  var params = {
    assemble: this
  };

  //this.dovetail.run(params, callback);

  async.series([

      // optionsBeforeConfiguration: 'options:before:configuration',
      stages.config(this),
      // optionsAfterConfiguration: 'options:after:configuration',


      // assembleBeforeLayout: 'assemble:before:layout',
      stages.buildLayout(this),
      // assembleAfterLayout: 'assemble:after:layout',

      // assembleBeforePartials: 'assemble:before:partials',
      stages.partials(this),
      // assembleAfterPartials: 'assemble:after:partials',

      // assembleBeforeData: 'assemble:before:data',
      stages.data(this),
      // assembleAfterData: 'assemble:after:data',

      // assembleBeforePages: 'assemble:before:pages',
      // assembleBeforePage: 'assemble:before:page',
      stages.buildPages(this),
      // assembleAfterPage: 'assemble:after:page',
      // assembleAfterPages: 'assemble:after:pages',

      // renderBeforePages: 'render:before:pages',
      // renderBeforePage: 'render:before:page',
      stages.renderPages(this)
      // renderAfterPage: 'render:after:page',
      // renderAfterPages: 'render:after:pages'

    ],
    stages.done(this, callback)
  );
};

Line.prototype.registerPlugin = function (name, description, options, fn) {
  this.dovetail.createPlugin(name, description, options, fn);
};