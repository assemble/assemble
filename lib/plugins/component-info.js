/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

'use strict';


module.exports = function(assemble) {

  var events = assemble.config.plugins.events;
  var options = {
    events: [
      events.assembleBeforeBuild,   // before building all components
      events.componentBeforeBuild,  // before building each component
      events.componentAfterBuild,   // after building each component
      events.assembleAfterBuild     // after building all components
    ]
  };

  assemble.registerPlugin('component-info', 'Adds additional component info to the context.', options, function (params, done) {

    assemble.log.debug('Component Info Plugin: ', params.event);
    assemble.log.debug('Params: ', params);

    switch (params.event) {

      case events.assembleBeforeBuild:
        done();
        break;

      case events.componentBeforeBuild:
        done();
        break;

      case events.componentAfterBUild:
        done();
        break;

      case events.assembleAfterBuild:
        done();
        break;

      default:
        // do nothing
        done();
        break;
    }

  });

};