

var async = require('async');

var utils = require('../utils');
var config = require('../config');
var notifier = require('./notifier');
var events = config.plugins.events;

/**
 * Register files
 *
 * @param   {Object} assemble
 * @param   {Function} nextStep
 *
 * @api private
 */

module.exports = function (assemble, params, nextStep) {
  var notify = notifier(assemble, params);

  assemble.log.debug('\t[files]: initializing');

  // initialize files cache if not done by a plugin
  assemble.files = assemble.files || {};

  var index = 0; // keep the order the files were given

  // loop over each file
  async.eachSeries(params.files, function (file, nextFile) {
    utils.component.expand(file);

    // assign the file to the parameters so
    // plugins can modify it if needed.
    params.file = file;
    params.file.data.index = index++;

    // run steps in series so we can notify plugins
    // before and after the file steps are done.
    async.series([

      // notify plugins before doing anything with the file
      notify(events.pageBeforeBuild),

      // do stuff with the file
      function (next) {
        var key = params.file.name || params.file.src || 'file_' + index;
        assemble.log.debug('\t[files]:', key);

        assemble.files[key] = params.file;

        // if the engine handles layouts, let it handle the file layout
        if (assemble.engine.handlesLayouts) {
          assemble.engine.loadComponentLayout(params.file, next);
        } else {
          next();
        }

      // notify plugins after handling the files
      }, notify(events.pageAfterBuild)

    ], nextFile);

  }, nextStep);
};
