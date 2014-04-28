var file = require('fs-utils');
var _ = require('lodash');

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
      var partial = assemble.utils.component.fromFile(filepath, 'partial');
      partial.name = file.basename(filepath);
      partials[filepath] = partial;
    });

    assemble.engine.registerPartials(partials, next);

  } else {
    next();
  }

};
