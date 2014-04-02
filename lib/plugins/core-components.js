
/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

'use strict';


module.exports = function(assemble) {

  var events = assemble.config.plugins.events;

  var plugin = function (params, done) {
    assemble.log.debug('Core Component Building Plugin: ', params.event);
    assemble.log.debug('Params: ', params);

    var currentPage = params.component;

    assemble.engine.registerComponents(currentPage.metadata.components || [], done);

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
