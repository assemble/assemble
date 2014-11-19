/*!
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
var es = require('event-stream');
var fs = require('vinyl-fs');
var _ = require('lodash');

var engineAssemble = require('engine-assemble');
var Context = require('context-manager');

var middleware = require('../middleware');

module.exports = function (Assemble) {

  /**
   * Initialize Assemble.
   *
   *   - setup default configuration
   *   - setup default middleware
   *
   * @api private
   */

  Assemble.prototype.loadDefaults = function() {
    this.initializing = true;

    /**
     * this.defaultConfig();
     * this.defaultOptions();
     * this.defaultDelimiters();
     * this.defaultRoutes();
     * this.defaultTemplates();
     * this.defaultEngines();
     */

    Assemble.__super__.loadDefaults.call(this);

    this.defaultPlugins();
    // this.defaultHighlighter();
    this.initializing = false;
  };

  /**
   * Initialize default configuration.
   *
   * @api private
   */

  Assemble.prototype.defaultConfig = function () {

    // defaultConfig from `engine`
    Assemble.__super__.defaultConfig.apply(this, arguments);

    // Set the environment
    var env = process.env.NODE_ENV || 'development';
    this.set('env', env);
    this.set('encoding', 'utf8');

    // dest config
    this.set('base', this.cache.cwd);
    this.set('assets', 'assets');
    this.set('root', 'dist');
  };

  Assemble.prototype.defaultOptions = function() {
    Assemble.__super__.defaultOptions.apply(this, arguments);

    this.option('viewEngine', '.hbs');
    this.option('destExt', '.html');
    this.option('ext', '.hbs');
    this.option('defaults', {
      isRenderable: true,
      isPartial: true,
      engine: '.hbs',
      ext: '.hbs'
    });


    // view defaults
    this.set('delims', ['{{', '}}']);
    this.set('views', 'templates');
    this.set('templates', 'templates');

    this.disable('default engines');
    this.disable('default routes');

    // routes
    this.enable('case sensitive routing');
    this.enable('strict routing');

    this.option('renameKey', function(filepath) {
      return path.basename(filepath, path.extname(filepath));
    });
  };

  Assemble.prototype.defaultDelimiters = function() {
    Assemble.__super__.defaultDelimiters.apply(this, arguments);
  };

  Assemble.prototype.defaultRoutes = function() {
    var self = this;
    Assemble.__super__.defaultRoutes.apply(this, arguments);

    /**
     * Path regex:
     *
     *   0 => full path
     *   1 => dirname
     *   2 => basename (with ext)
     *   3 => name (no ext)
     *   4 => extname
     *   5 => ext (no .)
     */
    var pathRe = /^(([\\\/]?|[\s\S]+?)(([^\\\/]+?)(?:(?:(\.(?:\.{1,2}|([^.\\\/]*))?|)(?:[\\\/]*))$))|$)/;
    this.onLoad(pathRe, middleware.parse(this));
    this.before(/./, middleware.assets(this));
  };

  /**
   * Private method to load default templates.
   *
   * @api private
   */

  Assemble.prototype.defaultTemplates = function() {
    // Assemble.__super__.defaultTemplates.apply(this, arguments);
    var opts = this.option('defaults');
    this.create('page', _.defaults({ isRenderable: true, isPartial: false }, opts));
    this.create('layout', _.defaults({ isLayout: true }, opts));
    this.create('partial', _.defaults({ isPartial: true }, opts));
  };

  /**
   * Private method to load default engines.
   *
   * @api private
   */

  Assemble.prototype.defaultEngines = function() {
    Assemble.__super__.defaultEngines.apply(this, arguments);
    this.engine(['*', 'hbs'], engineAssemble, {
      layoutDelims: ['{%', '%}'],
      destExt: '.html'
    });
  };

  /**
   * Private method to load default plugins.
   *
   * @api private
   */

  Assemble.prototype.defaultPlugins = function() {
    // enable all plugins
    this.disable('minimal config');

    // default `src` plugins
    this.enable('src:init plugin');
    this.enable('src:assets plugin');
    this.enable('src:extend plugin');
    this.enable('src:drafts plugin');
    this.enable('src:paginate plugin');

    // default `dest` plugins
    this.enable('dest:extend plugin');
    this.enable('dest:collections plugin');
    this.enable('dest:paths plugin');
    this.enable('dest:ext plugin');
    this.enable('dest:render plugin');
  };
};
