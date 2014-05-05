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

  var events = assemble.utils.middleware.events;

  var middleware = function (params, done) {
    assemble.log.debug('\t[core middleware]: ', 'pagination middleware: step 1', params.event);
    assemble.log.debug('\t[params]:', params);

    var i = 0;
    var prevPage = null;

    var pages = _.filter(assemble.pages, function (page) {
      return !('paginate' in page.data && page.data.paginate === false);
    });

    var keys = _.keys(pages);
    var j = keys.length;

    async.eachSeries(keys,
      function (key, next) {
        var page = pages[key];

        // Index and actual page number
        page.data.index = i;
        page.data.number = i + 1;

        // Is first page?
        page.data.first = (i === 0);

        // Previous page
        if (prevPage !== null) {
          page.data.prev = prevPage;
        }

        // Is a middle page?
        page.data.middle = i > 0 && i < (j - 1);

        // Next page
        if (i < j - 1) {
          page.data.next = i + 1;
        }

        // Is last page?
        page.data.last = i === (j - 1);

        prevPage = i;
        i++;

        next();
      },
    done);
  };

  middleware.options = {
    name: 'core-pagination-step1',
    description: 'Create pagination information for pages.',
    events: [
      events.assembleAfterBuild // after building all pages
    ]
  };

  var rtn = {};
  rtn[middleware.options.name] = middleware;
  return rtn;
};
