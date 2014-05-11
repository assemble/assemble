
var async = require('async');

var utils = require('../utils');
var utils = require('../utils');
var notifier = require('./notifier');
var events = utils.middleware.events;

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

  // initialize pages cache if not done by a middleware
  assemble.pages = assemble.pages || {};

  var index = 0; // keep the order the pages were given

  // loop over each page
  async.eachSeries(params.pages, function (page, nextPage) {
    utils.component.expand(page);

    // assign the page to the parameters so
    // middleware can modify it if needed.
    params.page = page;
    params.page.data.index = index++;

    // run steps in series so we can notify middleware
    // before and after the page steps are done.
    async.series([

      // notify middleware before doing anything with the page
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

      // notify middleware after handling the page
      }, notify(events.pageAfterBuild)

    ], nextPage);

  },
  function (err) {
    if (err) {
      assemble.log.error(err);
      return nextStep();
    }
    // build the source if
    if (!assemble.source || !(assemble.source instanceof assemble.models.Component)) {
      return nextStep();
    }

    utils.component.expand(assemble.source);
    params.page = assemble.source;
    params.page.data.index = index++;

    async.series([
      notify(events.pageBeforeBuild), function (next) {
        if (assemble.engine.handlesLayouts) {
          assemble.engine.loadComponentLayout(params.page, next);
        } else {
          next();
        }
      }, notify(events.pageAfterBuild)
    ], nextStep);
  });
};
