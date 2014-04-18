var file = require('fs-utils');
var async = require('async');
var _ = require('lodash');

var models = require('../models');
var Component = models.Component;

/**
 * Register partials/includes with the current
 * template engine.
 *
 * @param   {Object} assemble
 * @param   {Function} next
 *
 * @api private
 */

module.exports = function(assemble, next) {
  if (assemble.partials && assemble.partials.length > 0) {

    var partials = {};
    _.map(assemble.partials, function (filepath) {
      var partial = Component.readFile(filepath, 'partial');
      partial.name = file.basename(filepath);
      partials[filepath] = partial;
    });

    async.series([
      // register partials as ember style components
      function (nextStep) {
        if(assemble.engine.registerComponents) {
          var components = [];
          _.map(_.keys(partials), function (key) {
            components.push(partials[key]);
          });
          assemble.engine.registerComponents(components, nextStep);
        } else {
          nextStep();
        }
      },
      // register partials normally
      function (nextStep) {
        assemble.engine.registerPartials(partials, nextStep);
      }
    ],
    next);


  } else {
    next();
  }

};
