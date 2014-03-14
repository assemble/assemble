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
    assemble.log.debug('Core Pagination Plugin Step 1: ', params.event);
    assemble.log.debug('Params: ', params);

    var i = 0;
    var prevComponent = null;

    var keys = _.keys(assemble.components);
    var j = keys.length;

    async.eachSeries(keys,
      function (key, next) {
        var component = assemble.components[key];

        // Index and actual page number
        component.metadata.index = i;
        component.metadata.number = i + 1;

        // Is first component?
        component.metadata.first = (i === 0);

        // Previous component
        if (prevComponent !== null) {
          component.metadata.prev = prevComponent;
        }

        // Is a middle component?
        component.metadata.middle = i > 0 && i < (j - 1);

        // Next component
        if (i < j - 1) {
          component.metadata.next = i + 1;
        }

        // Is last component?
        component.metadata.last = i === (j - 1);

        prevComponent = i;
        i++;

        next();
      },
    done);
  };

  plugin.options = {
    name: 'core-pagination-step1',
    description: 'Create pagination information for page components.',
    events: [
      events.assembleAfterBuild // after building all components
    ]
  };

  var rtn = {};
  rtn[plugin.options.name] = plugin;
  return rtn;
};