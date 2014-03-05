/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

'use strict';

// node_modules
var async = require('async');
var _ = require('lodash');

// Local libs
var notifier = require('./notifier');
var config = require('../config');

var events = config.plugins.events;

module.exports = function(assemble, done) {

  assemble.log.debug('Running render steps');

  // setup parameters to pass to plugins
  var params = {};

  // setup a notifier to notify plugins
  var notify = notifier(assemble, params);

  // run steps in series so we can notify plugins
  // before and after the render steps are done
  async.series([

    // notify plugins before rendering
    notify(events.assembleBeforeRender),

    // do the render steps
    function (nextStep) {
      assemble.log.debug('Doing some render pages work here.');

      // loop over each component
      var componentKeys = _.keys(assemble.components);
      async.each(
        componentKeys,
        function (componentKey, nextComponent) {

          // add the current component to the params
          // so plugins and make modifications if needed.
          params.component = assemble.components[componentKey];
          config.context(assemble, params);

          // run steps in series so we can notify plugins
          // before and after the component steps are done.
          async.series([

            // notify plugins before rendering the contents
            notify(events.componentBeforeRender),

            // render the component
            function (nextRenderStep) {
              assemble.log.debug('Doing some page rending here.');

              assemble.engine.render(params.component.content, params.context, assemble.options, function (err, content) {
                assemble.log.debug('rending finished');
                if (err) {
                  assemble.log.err(err);
                  return nextRenderStep(err);
                }
                assemble.components[componentKey].content = content;
                nextRenderStep();
              });
            },

            // notify plugins after rendering the contents
            notify(events.componentAfterRender),

            // reset the assemble.context after rendering a component
            function (nextRenderStep) {
              assemble.context = function () {};
              nextRenderStep();
            }
          ],
          nextComponent);

        },
        nextStep);
    },
    notify(events.assembleAfterRender)
  ],
  done);
};