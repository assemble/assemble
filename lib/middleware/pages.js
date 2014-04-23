
var async = require('async');

var utils = require('../utils').utils;
var config = require('../config');
var notifier = require('./notifier');
var events = config.plugins.events;

/**
 * Register pages
 *
 * @param   {Object} assemble
 * @param   {Function} nextStep
 *
 * @api private
 */

module.exports = function (assemble, params, nextStep) {
  var notify = notifier(assemble, params);

  assemble.log.debug('\t[pages]: initializing');

  // initialize pages cache if not done by a plugin
  assemble.pages = assemble.pages || {};

  var index = 0; // keep the order the pages were given

  // loop over each page
  async.eachSeries(params.pages, function (page, nextPage) {
    utils.expandComponent(page);

    // assign the page to the parameters so
    // plugins can modify it if needed.
    params.page = page;
    params.page.metadata.index = index++;

    // run steps in series so we can notify plugins
    // before and after the page steps are done.
    async.series([

      // notify plugins before doing anything with the page
      notify(events.pageBeforeBuild),

      // do stuff with the page
      function (next) {
        var key = params.page.name || params.page.src || 'page_' + index;
        assemble.log.debug('\t[pages]:', key);

        assemble.pages[key] = params.page;

        // if the engine handles layouts, let it handle the page layout
        if (assemble.engine.handlesLayouts) {
          assemble.engine.loadComponentLayout(params.page, next);
        } else {
          next();
        }

      // notify plugins after handling the page
      }, notify(events.pageAfterBuild)

    ], nextPage);

  }, nextStep);
};
