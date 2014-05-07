/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

'use strict';

// node_modules
var _ = require('lodash');

module.exports = function(assemble) {

  var events = assemble.utils.middleware.events;

  var middleware = function (params, done) {
    assemble.log.debug('\t[core middleware]: ', 'pagination middleware: step 2', params.event);
    assemble.log.debug('\t[params]:', params);

    var pages = _.filter(assemble.pages, function (page) {
      return !('paginate' in page.data && page.data.paginate === false);
    });
    var currentPage = params.page;

    if ('paginate' in currentPage.data && currentPage.data.paginate === false) {
      return done();
    }

    var keys = _.keys(pages);

    params.context.pager = {

      // if the current page is not the first page, get the first page
      first      : pages[keys[0]],

      // if there is a previous page set, use that, otherwise use the first page
      prev       : pages[keys[currentPage.data.prev   || 0]],

      // is this a middle page?
      middle     : currentPage.data.middle,

      // if there is a next page set, use that, otherwise use the last page
      next       : pages[keys[currentPage.data.next   || (keys.length - 1)]],

      // if the current page is not the last page, get the last page
      last       : pages[keys[(keys.length - 1)]],

      // current page info
      index      : currentPage.data.index,
      number     : currentPage.data.index + 1,
      currentPage: currentPage.data.index + 1,
      totalPages : keys.length
    };

    done();
  };


  middleware.options = {
    name: 'core-pagination-step2',
    description: 'Create pagination information for pages.',
    events: [
      events.pageBeforeRender  // before rendering each page
    ]
  };

  var rtn = {};
  rtn[middleware.options.name] = middleware;
  return rtn;
};
