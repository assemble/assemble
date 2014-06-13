/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

var resolve = require('resolve-dep');
var grunt = require('grunt');
var async = require('async');
var _ = require('lodash');

// The module to be exported.
var plugins = module.exports = {};

plugins.resolve = function (_plugins, options) {
  options = options || {};
  var resolved = resolve(_plugins).map(function(plugin) {
    try {
      return require(plugin);
    } catch(e) {
      return plugin;
    }
  });

  // set plugin options
  resolved.forEach(function (plugin) {
    plugin.options = _.extend({}, {
      stage: 'render:pre:page'
    }, plugin.options);
  });
  return resolved;
};


/**
 * ## .isStageMatch(a, b)
 *
 * Return true if segments match, or if `*` is defined.
 *
 * @method  isStageMatch
 * @param   {Array} `a`
 * @param   {Array} `b`
 * @return  {Boolean}
 */

var isStageMatch = function(a, b) {
  return ((a[0] === b[0]) || (a[0] === '*')) &&
         ((a[1] === b[1]) || (a[1] === '*')) &&
         ((a[2] === b[2]) || (a[2] === '*'));
};


plugins.runner = function (stage, params) {
  params.stage = stage;
  var assemble = params.assemble;

  var pluginsOfType = _.filter(assemble.options.plugins, function (plugin) {
    var pluginParts = plugin.options.stage.split(':');
    var stageParts = stage.split(':');
    return isStageMatch(pluginParts, stageParts);
  });

  return function (done) {
    async.forEachSeries(pluginsOfType, function (plugin, next) {
        if(typeof plugin === 'function') {
          plugin(params, next);
        } else {
          next();
        }
      },
      function (err) {
        if (err) {grunt.log.error(err); done(err);}
        else {done();}
      }
    );
  };
};

plugins.buildStep = function(stage, params) {
  return function(assemble, next) {
    plugins.runner(stage, params)(function() {
      next(assemble);
    });
  };
};

