var async = require('async');

var utils = require('../utils').utils;
var config = require('../config');
var notifier = require('./notifier');
var events = config.plugins.events;

/**
 * Register components
 *
 * @param   {Object} assemble
 * @param   {Function} nextStep
 *
 * @api private
 */

module.exports = function (assemble, params, nextStep) {
  var notify = notifier(assemble, params);

  assemble.log.debug('\t[components]: initializing');

  // initialize components cache if not done by a plugin
  assemble.components = assemble.components || {};

  var index = 0; // keep the order the components were given

  // loop over each component
  async.eachSeries(params.components, function (component, nextComponent) {
    utils.expandComponent(component);

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
        var key = params.component.name || params.component.src || 'component_' + index;
        assemble.log.debug('\t[components]:', key);

        assemble.components[key] = params.component;

        // if the engine handles layouts, let it handle the component layout
        if (assemble.engine.handlesLayouts) {
          assemble.engine.loadComponentLayout(params.component, next);
        } else {
          next();
        }

      // notify plugins after handling the component
      }, notify(events.componentAfterBuild)

    ], nextComponent);

  }, nextStep);
};