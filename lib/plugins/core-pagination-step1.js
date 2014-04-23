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
    assemble.log.debug('\t[core plugin]: ', 'pagination plugin: step 1', params.event);
    assemble.log.debug('\t[params]:', params);

    var i = 0;
    var prevPage = null;

    var keys = _.keys(assemble.pages);
    var j = keys.length;

    async.eachSeries(keys,
      function (key, next) {
        var page = assemble.pages[key];

        // Index and actual page number
        page.metadata.index = i;
        page.metadata.number = i + 1;

        // Is first page?
        page.metadata.first = (i === 0);

        // Previous page
        if (prevPage !== null) {
          page.metadata.prev = prevPage;
        }

        // Is a middle page?
        page.metadata.middle = i > 0 && i < (j - 1);

        // Next page
        if (i < j - 1) {
          page.metadata.next = i + 1;
        }

        // Is last page?
        page.metadata.last = i === (j - 1);

        prevPage = i;
        i++;

        next();
      },
    done);
  };

  plugin.options = {
    name: 'core-pagination-step1',
    description: 'Create pagination information for pages.',
    events: [
      events.assembleAfterBuild // after building all pages
    ]
  };

  var rtn = {};
  rtn[plugin.options.name] = plugin;
  return rtn;
};
