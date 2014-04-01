
/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

'use strict';

// node_modules
var async = require('async');
var _ = require('lodash');

module.exports = function(assemble) {

  var events = assemble.config.plugins.events;

  var plugin = function (params, done) {
    assemble.log.debug('Core Component Building Plugin: ', params.event);
    assemble.log.debug('Params: ', params);

    var currentPage = params.component;

    async.eachSeries(currentPage.metadata.components || [],
      function (component, next) {
        var componentName = _.str.camelize(component.name);
        // camel case component name to be used as a helper
        var componentHelper = function (options) {
          var context = _.merge({}, params.context, options.hash || {});
          var tmpl = assemble.Handlebars.compile(component.content, { data: true});
          var content = tmpl(context, { data: context });

          return new assemble.Handlebars.SafeString(content);
        };

        var helpers = {};
        helpers[componentName] = componentHelper;
        assemble.registerHelpers(helpers, next);
      },
    done);

  };

  plugin.options = {
    name: 'core-component building',
    description: 'Build components to be included in pages.',
    events: [
      events.componentBeforeRender  // before rendering each component
    ]
  };

  var rtn = {};
  rtn[plugin.options.name] = plugin;
  return rtn;
};
