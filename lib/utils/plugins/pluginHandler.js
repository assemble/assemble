/**
 * Assemble
 *
 * Assemble <http://assemble.io>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2013 Upstage.
 * Licensed under the MIT License (MIT).
 */

var events = require('events');
var path = require('path');
var fs = require('fs');

var resolve = require('resolve-dep');
var ewait = require('ewait');
var grunt = require('grunt');
var async = require('async');
var _ = require('lodash');

var plugins = require('./');

var isStageMatch = function(a, b) {
	return (a === b) || a === '*';
};


var PluginHandler = module.exports = function() {
	this.cache = {};
};

PluginHandler.prototype.setCache = function(stage, plugin) {
  (this.cache[stage] = this.cache[stage] || []).push(plugin);
};

PluginHandler.prototype.getCache = function(stage) {
  return (this.cache[stage] || []);
};

PluginHandler.prototype.expandStages = function(pluginStages) {
  if(!_.isArray(pluginStages)) {
    pluginStages = [pluginStages];
  }

  return _.filter(plugins.stages, function(stage) {
    var stageParts = stage.split(':');
    var isMatch = false;
    _.map(pluginStages, function(pluginStage) {
      var pluginParts = pluginStage.split(':');
      isMatch = isMatch || (isStageMatch(pluginParts[0], stageParts[0]) &&
                            isStageMatch(pluginParts[1], stageParts[1]) &&
                            isStageMatch(pluginParts[2], stageParts[2]));
    });
    return isMatch;
  });
};

PluginHandler.prototype.addListeners = function(stages, plugin) {
	var self = this;
  // setup a listener for each stage this plugin registered
  stages = self.expandStages(stages);
  stages.forEach(function(stage) {
    self.setCache(stage, plugin);
    plugin.listen(stage);
  });
};

PluginHandler.prototype.createPlugin = function(fn, line) {
	var plugin = new plugins.Plugin(fn, line);
	var stages = fn.options.stage || fn.options.stages || [];
	this.addListeners(stages, plugin);
	return plugin;
};

/**
 * Find plugins and load them based on the list of plugins
 * @param  {[type]} line     [description]
 * @param  {[type]} _plugins [description]
 * @param  {[type]} options  [description]
 * @return {[type]}          [description]
 */
PluginHandler.prototype.resolve = function(line, _plugins, options) {
  var self = this;
  options = options || {};
  _plugins = _plugins || [];
  if(!_.isArray(_plugins)) {
    _plugins = [_plugins];
  }
  var actualPlugins = [];

  _plugins.forEach(function(plugin) {
    // if plugin is a string, attempt to resolve to module
    if(_.isString(plugin)) {
      var resolved = resolve.all(plugin);
      // if resolved to an npm module then use it, otherwise assume local file/pattern so expand
      var relPaths = resolve.length ? resolved : grunt.file.expand(plugin);
      var resolvedPlugins = relPaths.map(function(relPath) {
        // normalize the relative path given current working directory
        var fullPath = path.normalize(path.join(options.cwd || process.cwd() || '', relPath));
        try {
          var required = require(fullPath);
          return required;
        } catch (ex) {
          grunt.log.writeln('Error requiring plugin "' + plugin + '"');
          grunt.log.writeln(ex);
        }
      });
      actualPlugins = actualPlugins.concat(resolvedPlugins || []);
    }
    // otherwise, assume plugin is already a function
    else {
      actualPlugins.push(plugin);
    }
  });

  // set plugin options
  actualPlugins = _.map(actualPlugins, function(plugin) {
    plugin.options = plugin.options || {};
    plugin.options.stage = plugin.options.stage || (plugin.options.stage = plugin.options.stages || plugins.stages.renderPrePage);
    return self.createPlugin(plugin, line);
  });
  return actualPlugins;
};

PluginHandler.prototype.run = function(line, params, done) {
  var self = this;
  async.forEachSeries(_.keys(plugins.stages), function(key, next) {
    var stage = plugins.stages[key];
    var cache = self.getCache(stage);
    if(cache && cache.length) {
      ewait.waitForAll(cache, function(err) {
        if (err) { grunt.log.error(err); next(); }
        else { next(); }
      });
      line.emit(stage, _.extend({stage: stage}, params));
    } else {
      next();
    }
  },
  function (err) {
    if (err) { grunt.log.error(err); done(); }
    else { done(); }
  });
};