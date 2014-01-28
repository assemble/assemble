/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

var plugins = module.exports = {};

// plugin events that we emit
plugins.events = {
  optionsBeforeConfiguration: 'options:before:configuration',
  optionsAfterConfiguration: 'options:after:configuration',
  assembleBeforeLayout: 'assemble:before:layout',
  assembleAfterLayout: 'assemble:after:layout',
  assembleBeforePartials: 'assemble:before:partials',
  assembleAfterPartials: 'assemble:after:partials',
  assembleBeforeData: 'assemble:before:data',
  assembleAfterData: 'assemble:after:data',
  assembleBeforePages: 'assemble:before:pages',
  assembleBeforePage: 'assemble:before:page',
  assembleAfterPage: 'assemble:after:page',
  assembleAfterPages: 'assemble:after:pages',
  renderBeforePages: 'render:before:pages',
  renderBeforePage: 'render:before:page',
  renderAfterPage: 'render:after:page',
  renderAfterPages: 'render:after:pages'
};