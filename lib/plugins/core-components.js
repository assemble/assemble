/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

'use strict';


module.exports = function(assemble) {

  var events = assemble.utils.plugins.events;

  var plugin = function (params, done) {
    assemble.log.debug('\t[core plugin]: ', 'core-component building plugin', params.event);
    assemble.log.debug('\t[params]:', params);

    var currentPage = params.page;

    assemble.engine.registerComponents(currentPage.data.components || [], done);

  };

  plugin.options = {
    name: 'core-component building',
    description: 'Build components to be included in pages.',
    events: [
      events.pageBeforeRender  // before rendering each page
    ]
  };

  var rtn = {};
  rtn[plugin.options.name] = plugin;
  return rtn;
};
