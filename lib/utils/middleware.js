/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

var middleware = module.exports = {};

// middleware events that we emit
middleware.events = {
  assembleBeforeConfiguration: 'assemble:before:configuration',
  assembleAfterConfiguration: 'assemble:after:configuration',
  assembleBeforeData: 'assemble:before:data',
  assembleAfterData: 'assemble:after:data',
  assembleBeforeBuild: 'assemble:before:build',
  pageBeforeBuild: 'page:before:build',
  pageAfterBuild: 'page:after:build',
  assembleAfterBuild: 'assemble:after:build',
  assembleBeforeRender: 'assemble:before:render',
  pageBeforeRender: 'page:before:render',
  pageAfterRender: 'page:after:render',
  assembleAfterRender: 'assemble:after:render'
};
