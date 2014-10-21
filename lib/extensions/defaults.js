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
    Assemble.__super__.init.call(this);
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

    // src config
    this.set('cwd', process.cwd());
    this.set('ext', '.html');

    // dest config
    this.set('base', this.cache.cwd);
    this.set('assets', 'assets');
    this.set('root', 'dist');

    // data
    this.set('imports', {});
    this.set('locals', {});
    this.set('data', {});

    // view defaults
    this.set('delims', ['{{', '}}']);
    this.set('views', 'templates');
    this.set('templates', 'templates');

    this.option('helpers', 'helpers');
    this.option('templates', 'templates');
    this.option('partials', this.options.templates + '/partials');
    this.option('layouts', this.options.templates + '/layouts');
    this.option('rename', function(filepath) {
      return path.basename(filepath, path.extname(filepath));
    });

    this.listen(this);

    // routes
    this.enable('case sensitive routing');
    this.enable('strict routing');
    this.enable('flatten');

    this.defaultContexts();
    this.defaultPlugins();
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
    this.enable('buffer plugin');
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
   * Private method to setup event listeners on Assemble.
   *
   * @api private
   */

  Assemble.prototype.listen = function() {
    this.on('set', function (key, value) {
      if (this.initializing) return;

      if (key === 'partials') {
        this.partials(value);
      }
      if (key === 'pages') {
        this.pages(value);
      }
      if (key === 'layouts') {
        this.layouts(value);
      }
    });

    this.on('option', function (key, value) {
      if (this.initializing) return;

      if (typeof key === 'object') {
        // expand and process
        var options = _.extend({}, key);
        var data = {};
        if (options.hasOwnProperty('data')) {
          data = options.data;
          delete options.data;
        }
        this.data(options, true);
        this.data(this.plasma(data), true);
      }

      if (key === 'partials') {
        this.partials(value);
      }
      if (key === 'pages') {
        this.pages(value);
      }
      if (key === 'layouts') {
        this.layouts(value);
      }
    });
  };


  /**
   * Intialize default contexts and context levels.
   *
   * @api private
   */

  Assemble.prototype.defaultContexts = function() {
    this.context = new Context();

    // Add `this.cache` and `this.data` to the context
    this.context.add('cache', 10);
    this.context.add('data', 20);

    // Create a namespaced context for each template
    this.context.add('layouts', 30);
    this.context.add('pages', 40);
    this.context.add('partials', 50);

    // Add a context for each template type
    this.context.add('layout', 60);
    this.context.add('page', 80);
    this.context.add('partial', 90);

    // Add a context for locals and front-matter
    this.context.add('locals', 100);
    this.context.add('matter', 110);
  };


  /**
   * Set the current working directory for all paths.
   * Default is `process.cwd()`, this does not need to
   * be changed unless you require something different.
   *
   * ```js
   * assemble.cwd('bench');
   * ```
   *
   * @param  {String|Array} `args` File path or paths.
   * @return {String}
   * @api public
   */

  Assemble.prototype.cwd = function () {
    var cwd = this.cache.cwd || process.cwd();
    var args = [].slice.call(arguments);
    if (!args.length) {
      return cwd;
    }
    var paths = [cwd].concat(args);
    return path.join.apply(path, paths);
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