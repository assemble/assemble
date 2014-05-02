/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

'use strict';


module.exports = function(assemble) {

  var events = assemble.utils.middleware.events;

  var middleware = function (params, done) {
    assemble.log.debug('\t[core middleware]: ', 'core-component building middleware', params.event);
    assemble.log.debug('\t[params]:', params);

    var currentPage = params.page;

    assemble.engine.registerComponents(currentPage.data.components || [], done);

  };

  middleware.options = {
    name: 'core-component building',
    description: 'Build components to be included in pages.',
    events: [
      events.pageBeforeRender  // before rendering each page
    ]
  };

  var rtn = {};
  rtn[middleware.options.name] = middleware;
  return rtn;
};
