/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */
// jshint ignore:start
'use strict';

module.exports = function(assemble) {

  // events commented out for demo purposes
  var events = assemble.config.plugins.events;
  var options = {
    events: [
      // // add events from the events "enum"
      // events.assembleBeforeConfiguration,
      // events.assembleAfterConfiguration,
      // // or add them directly with a string and/or wildcards
      // 'assemble:*:build'
    ]
  };

  assemble.registerPlugin('javascript-example', 'This is a plugin written in JavaScript.', options, function (params, next) {
    console.log('JavaScript Example Plugin', params.event);
    next();
  });
};
// jshint ignore:end
