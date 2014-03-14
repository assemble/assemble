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

  var events = assemble.config.plugins.events;

  var plugin = function (params, done) {
    assemble.log.debug('Core Pagination Plugin Step 2: ', params.event);
    assemble.log.debug('Params: ', params);

    var components  = assemble.components;
    var currentPage = params.component;

    var keys = _.keys(components);

    params.context.pagination = {

      // if the current page is not the first page, get the first page
      first      : currentPage.metadata.first || components[keys[0]],

      // if there is a previous page set, use that, otherwise use the first page
      prev       : components[keys[currentPage.metadata.prev   || 0]],

      // is this a middle page?
      middle     : currentPage.metadata.middle,

      // if there is a next page set, use that, otherwise use the last page
      next       : components[keys[currentPage.metadata.next   || (keys.length - 1)]],

      // if the current page is not the last page, get the last page
      last       : currentPage.metadata.last || components[keys[(keys.length - 1)]],

      // current page info
      index      : currentPage.index,
      number     : currentPage.index + 1,
      currentPage: currentPage.index + 1,
      totalPages : keys.length
    };

    done();
  };


  plugin.options = {
    name: 'core-pagination-step2',
    description: 'Create pagination information for page components.',
    events: [
      events.componentBeforeRender  // before rendering each component
    ]
  };

  var rtn = {};
  rtn[plugin.options.name] = plugin;
  return rtn;
};