/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

var plugins = module.exports = {};

// plugin events that we emit
plugins.events = {
  assembleBeforeConfiguration: 'assemble:before:configuration',
  assembleAfterConfiguration: 'assemble:after:configuration',
  assembleBeforeData: 'assemble:before:data',
  assembleAfterData: 'assemble:after:data',
  assembleBeforeBuild: 'assemble:before:build',
  componentBeforeBuild: 'component:before:build',
  componentAfterBuild: 'component:after:build',
  assembleAfterBuild: 'assemble:after:build',
  assembleBeforeRender: 'assemble:before:render',
  componentBeforeRender: 'component:before:render',
  componentAfterRender: 'component:after:render',
  assembleAfterRender: 'assemble:after:render'
};