/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

'use strict';

// node_modules
var async = require('async');

// Local libs
var notifier = require('./notifier');
var config = require('../config');

var events = config.plugins.events;

module.exports = function(assemble, done) {

  assemble.log.debug('Running build steps');

  // setup parameters to pass to plugins
  var params = {};

  // setup a notifier to notify plugins
  var notify = notifier(assemble, params);

  // provide plugins with the list of components
  // so they can be modified if needed
  params.components = assemble.options.components;

  // run steps in series so we can notify plugins
  // before and after the build steps are done
  async.series([

    // notify plugins before the build
    notify(events.assembleBeforeBuild),
    function (nextStep) {
      assemble.log.debug('Doing some building work here.');

      // initialize components cache if not done by a plugin
      assemble.components = assemble.components || {};

      var index = 0; // keep the order the components were given

      // loop over each component
      async.eachSeries(
        params.components,
        function (component, nextComponent) {

          // assign the component to the parameters so 
          // plugins can modify it if needed.
          params.component = component;
          params.component.metadata.index = index++;

          // run steps in series so we can notify plugins
          // before and after the component steps are done.
          async.series([

            // notify plugins before doing anything with the component
            notify(events.componentBeforeBuild),

            // do stuff with the component
            function (next) {
              assemble.log.debug('Doing some component work here.');

              var key = params.component.name || params.component.src || 'component_' + index;
              assemble.components[key] = params.component;

              next();

            },

            // notify plugins after handling the component
            notify(events.componentAfterBuild)
          ],
          nextComponent);

        },
        nextStep);
    },

    // notify plugins after the build
    notify(events.assembleAfterBuild)
  ],
  done);
};