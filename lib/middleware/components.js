
var file = require('fs-utils');
var _ = require('lodash');

var models = require('../models');
var Component = models.Component;

/**
 * Register components with the current
 * template engine.
 *
 * @param   {Object} assemble
 * @param   {Function} next
 *
 * @api private
 */

module.exports = function(assemble, next) {
  if (assemble.components && assemble.components.length > 0) {
    // load components so we can give it a good name
    var components = [];
    _.map(assemble.components, function (filepath) {
      var component = Component.readFile(filepath, 'component');
      component.name = file.basename(filepath);
      components.push(component);
    });
    assemble.engine.registerComponents(components, next);
  } else {
    next();
  }

};
