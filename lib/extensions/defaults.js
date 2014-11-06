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

var engineHandlebars = require('engine-handlebars');
var parser = require('parser-front-matter');
var Context = require('context-manager');
var hljs = require('highlight.js');

module.exports = function (Assemble) {

  /**
   * Initialize Assemble.
   *
   *   - setup default configuration
   *   - setup default middleware
   *
   * @api private
   */

  Assemble.prototype.init = function() {
    this.initializing = true;

    /**
     * this.defaultConfig();
     * this.defaultOptions();
     * this.defaultDelimiters();
     * this.defaultRoutes();
     * this.defaultTemplates();
     * this.defaultEngines();
     */
    
    Assemble.__super__.initTemplate.call(this);

    this.defaultPlugins();
    this.defaultHighlighter();
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

    this.disable('default engines');
    this.disable('default routes');

    // view defaults
    this.set('delims', ['{{', '}}']);
    this.set('views', 'templates');
    this.set('templates', 'templates');

    // routes
    this.enable('case sensitive routing');
    this.enable('strict routing');
    this.enable('flatten');

    this.option('helpers', 'helpers');
    this.option('templates', 'templates');
    this.option('partials', this.options.templates + '/partials');
    this.option('layouts', this.options.templates + '/layouts');
    this.option('rename', function(filepath) {
      return path.basename(filepath, path.extname(filepath));
    });

  };

  Assemble.prototype.defaultDelimiters = function() {
    Assemble.__super__.defaultDelimiters.apply(this, arguments);
  };

  Assemble.prototype.defaultRoutes = function() {
    Assemble.__super__.defaultRoutes.apply(this, arguments);
    this.route(/^(\/?|[\s\S]*?)(([^\/]+?)(((\.(?:\.{1,2}|([^.\/]*))?|)(?:[\/]*))$))|$/).all(function route(file, next) {
      /*
       * 0 => dirname
       * 1 => filename (basename + ext)
       * 2 => basename
       * 3 => ext
       * 4 => ext
       * 5 => ext
       * 6 => ext without .
       */
      var basename = file.params[2];
      var ext = file.params[6];
      if (basename && (ext == undefined || ext == 'hbs')) {
        parser.parse(file, function(err) {
          if (err) return next(err);
          next();
        });
      }
    });
  };

  /**
   * Private method to load default templates.
   *
   * @api private
   */
  
  Assemble.prototype.defaultTemplates = function() {
    // Assemble.__super__.defaultTemplates.apply(this, arguments);
    var opts = this.option('defaults');
    this.create('page', _.defaults({ isRenderable: true }, opts));
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
    this.engine(['*', 'hbs'], engineHandlebars, {
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
    this.enable('init plugin');
    this.enable('assets plugin');
    this.enable('src-routes plugin');
    this.enable('extend-src plugin');
    this.enable('parser plugin');
    this.enable('drafts plugin');
    this.enable('paginate plugin');

    // default `dest` plugins
    this.enable('extend-dest plugin');
    this.enable('collections plugin');
    this.enable('dest plugin');
    this.enable('dest-routes plugin');
    this.enable('render plugin');
  };

  /**
   * Private method to register default syntax highlighter.
   *
   * @api private
   */

  Assemble.prototype.defaultHighlighter = function() {
    this.highlight(function (code, lang) {
      if (lang) {
        return hljs.highlight(lang, code).value;
      }
      return hljs.highlightAuto(code).value;
    });
  };

  /**
   * Register a function for syntax highlighting.
   *
   * By default, Assemble uses highlight.js for syntax highlighting.  It's not
   * necessary to register another function unless you want to override the default.
   *
   * **Examples:**
   *
   * ```js
   * assemble.highlight(function(code, lang) {
   *   if (lang) {
   *     return hljs.highlight(lang, code).value;
   *   }
   *   return hljs.highlightAuto(code).value;
   * });
   * ```
   *
   * @param {Function} `fn`
   * @return {Object} `Assemble` to enable chaining.
   * @api public
   */

  Assemble.prototype.highlight = function (code, lang) {
    if (typeof code === 'function') {
      this.highlighter = code;
      return this;
    }

    if (this.highlighter) {
      return this.highlighter(code, lang);
    }
    return code;
  };


};