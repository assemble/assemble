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
var utils = require('../utils');

var events = utils.middleware.events;

module.exports = function(assemble, done) {
  assemble.log.debug('\t[render]:', 'initializing');

  // setup parameters to pass to middleware
  var params = {};

  // setup a notifier to notify middleware
  var notify = notifier(assemble, params);

  // run steps in series so we can notify middleware
  // before and after the render steps are done
  async.series([

    // notify middleware before rendering
    notify(events.assembleBeforeRender), function (nextStep) {
      assemble.log.debug('\t[render]:', 'starting render steps');

      // loop over each page
      var pageKeys = _.keys(assemble.pages);
      async.each(pageKeys, function (pageKey, nextPage) {

          // add the current page to the params
          // so middleware and make modifications if needed.
          params.page = assemble.pages[pageKey];
          utils.context(assemble, params);

          // run steps in series so we can notify middleware
          // before and after the page steps are done.
          async.series([

            // notify middleware before rendering the contents
            notify(events.pageBeforeRender),

            // render the page
            function (nextRenderStep) {
              assemble.log.debug('\t[render]:', 'rendering pages');

              assemble.engine.render(params.page.content, params.context, assemble.config, function (err, content) {
                assemble.log.debug('\t[render]:', 'rendering done.');
                if (err) {
                  assemble.log.error(err);
                  return nextRenderStep(err);
                }
                assemble.pages[pageKey].content = content;
                nextRenderStep();
              });
            },

            // notify middleware after rendering the contents
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

    // render source
    function (nextStep) {
      assemble.log.debug('\t[render]:', 'staring source render steps');

      if (!assemble.source || !(assemble.source instanceof assemble.models.Component)) {
        return nextStep();
      }

      params.page = assemble.source;
      utils.context(assemble, params);

      async.series([
        notify(events.pageBeforeRender), function (nextRenderStep) {
          assemble.log.debug('\t[render]:', 'rendering source');
          assemble.engine.render(params.page.content, params.context, assemble.config, function (err, content) {
            assemble.log.debug('\t[render]:', 'rendering done.');
            if (err) {
              assemble.log.error(err);
              return nextRenderStep(err);
            }
            assemble.source.content = content;
            nextRenderStep();
          });
        },
        notify(events.pageAfterRender), function (nextRenderStep) {
          assemble.context = function () {};
          nextRenderStep();
        }
      ],
      nextStep);
    },

    notify(events.assembleAfterRender)
  ],
  done);
};
