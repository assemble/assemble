

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
    assemble.log.debug('\t[core plugin]: ', 'core-index-pages plugin', params.event);
    assemble.log.debug('\t[params]:', params);

    done();
  };

  plugin.options = {
    name: 'core-index-pages',
    description: 'Build index pages.',
    events: [
      events.assembleBeforeBuild  // before building the pages
    ]
  };

  var rtn = {};
  rtn[plugin.options.name] = plugin;
  return rtn;
};
