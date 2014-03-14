/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

'use strict';

// node_modules
var relative = require('relative');
var file = require('fs-utils');
var async = require('async');
var _ = require('lodash');

module.exports = function(assemble) {

  var events = assemble.config.plugins.events;

  var plugin = function (params, done) {
    assemble.log.debug('Core Component Info Plugin: ', params.event);
    assemble.log.debug('Params: ', params);

    // setup info on all the components
    async.each(_.keys(assemble.components),
      function (key, next) {
        var component = assemble.components[key];
        var dest = component.dest || '.';

        var context = {};
        context.dest = dest;
        context.dirname = file.dirname(dest);
        context.filename = file.filename(dest);
        context.pageName = context.filename;
        context.pagename = context.filename;
        context.basename = file.basename(dest);
        context.assets = relative(dest, assemble.options.assets || '');
        context.ext = assemble.options.ext;
        context.extname = assemble.options.ext;

        component.metadata = _.extend({}, component.metadata || {}, context);
        next();
      },
    done);

  };


  plugin.options = {
    name: 'core-paths',
    description: 'Adds additional component info to the context.',
    events: [
      events.assembleAfterBuild     // after building all components
    ]
  };

  var rtn = {};
  rtn[plugin.options.name] = plugin;
  return rtn;
};