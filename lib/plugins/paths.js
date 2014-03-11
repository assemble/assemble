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
    assemble.log.debug('Component Info Plugin: ', params.event);
    assemble.log.debug('Params: ', params);

    // setup info on all the components
    async.each(_.keys(assemble.components),
      function (key, next) {
        var component = assemble.components[key];
        var dest = component.dest || '.';
        component.dirname = file.dirname(dest);
        component.filename = file.filename(dest);
        component.pageName = component.filename;
        component.pagename = component.filename;
        component.basename = file.basename(dest);
        component.assets = relative(dest, assemble.options.assets || '');
        component.ext = assemble.options.ext;
        component.extname = assemble.options.ext;
        next();
      },
    done);

  };


  plugin.options = {
    name: 'paths',
    description: 'Adds additional component info to the context.',
    events: [
      events.assembleAfterBuild     // after building all components
    ]
  };

  var rtn = {};
  rtn[plugin.options.name] = plugin;
  return rtn;
};