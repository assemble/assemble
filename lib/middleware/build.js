/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

'use strict';

var async = require('async');

// Local libs
var notifier = require('./notifier');
var config = require('../config');
var registerPartials = require('./partials');
var registerComponents = require('./components');

var events = config.plugins.events;



module.exports = function(assemble, done) {

  assemble.log.debug('Running build steps');

  // setup parameters to pass to plugins
  var params = {};

  // setup a notifier to notify plugins
  var notify = notifier(assemble, params);

  // provide plugins with the list of components
  // so they can be modified if needed
  params.components = assemble.options.components || [];

  // run steps in series so we can notify plugins
  // before and after the build steps are done
  async.series([

    // notify plugins before the build
    notify(events.assembleBeforeBuild),

    /**
     * register partials with the current engine
     *
     * @param   {Function} nextStep
     * @return  {Function} callback
     */

    function (nextStep) {
      registerPartials(assemble, nextStep);
    },

    /**
     * register components
     *
     * @param   {Function} nextStep
     * @return  {Function} callback
     */

    function (nextStep) {
      registerComponents(assemble, params, nextStep);
    },

    // notify plugins after the build
    notify(events.assembleAfterBuild)
  ],
  done);
};