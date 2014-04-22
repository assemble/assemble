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

  assemble.log.debug('\t[render]:', 'initializing');

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
      assemble.log.debug('\t[render]:', 'starting render steps');

      // loop over each page
      var pageKeys = _.keys(assemble.pages);
      async.each(
        pageKeys,
        function (pageKey, nextPage) {

          // add the current page to the params
          // so plugins and make modifications if needed.
          params.page = assemble.pages[pageKey];
          config.context(assemble, params);

          // run steps in series so we can notify plugins
          // before and after the page steps are done.
          async.series([

            // notify plugins before rendering the contents
            notify(events.pageBeforeRender),

            // render the page
            function (nextRenderStep) {
              assemble.log.debug('\t[render]:', 'rendering pages');

              assemble.engine.render(params.page.content, params.context, assemble.options, function (err, content) {
                assemble.log.debug('\t[render]:', 'rendering done.');
                if (err) {
                  assemble.log.err(err);
                  return nextRenderStep(err);
                }
                assemble.pages[pageKey].content = content;
                nextRenderStep();
              });
            },

            // notify plugins after rendering the contents
            notify(events.pageAfterRender),

            // reset the assemble.context after rendering a page
            function (nextRenderStep) {
              assemble.context = function () {};
              nextRenderStep();
            }
          ],
          nextPage);

        },
        nextStep);
    },
    notify(events.assembleAfterRender)
  ],
  done);
};
