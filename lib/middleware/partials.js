var file = require('fs-utils');
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

    assemble.engine.registerPartials(partials, next);

  } else {
    next();
  }

};
