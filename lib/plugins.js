/**
 * Assemble Plugins
 * Assemble <http://assemble.io>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2013 Upstage.
 * Licensed under the MIT License (MIT).
 */

// Node.js
var path = require('path');
var fs   = require('fs');

// node_modules
var resolve = require('resolve-dep');
var grunt = require('grunt');
var async = grunt.util.async;
var _ = grunt.util._;

// The module to be exported.
var plugins = module.exports = {};

plugins.resolve = function (_plugins, options) {
  options = options || {};
  _plugins = _plugins || [];

  var actualPlugins = [];

  _plugins.forEach(function (plugin) {

    // if plugin is a string, attempt to resolve to module
    if (_.isString(plugin)) {

      var resolved = resolve.all(plugin);
      // if resolved to an npm module then use it, otherwise assume local file/pattern so expand
      var relPaths = resolved.length ? resolved : grunt.file.expand(plugin);

      var resolvedPlugins = relPaths.map(function(relPath) {
        
        // normalize the relative path given current working directory
        var fullPath = path.normalize(path.join(options.cwd || process.cwd() || '', relPath));
        try {
          var required = require(fullPath);
          return required;
        }
        catch (ex) {
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
  actualPlugins.forEach(function (plugin) {
    plugin.options = _.extend({}, {
      stage: 'each'
    }, plugin.options);
  });

  return actualPlugins;
};

plugins.runner = function (stage, params) {
  var assemble = params.assemble;
  var pluginsOfType = _.filter(assemble.options.plugins, function (plugin) {
    return plugin.options.stage == stage;
  });
  return function (done) {
    async.forEachSeries(
      pluginsOfType,
      function (plugin, next) {
        plugin(params, next);
      },
      function (err) {
        if (err) {
          grunt.log.error(err);
          done(err);
        }
        else done();
      }
    );
  };
};
