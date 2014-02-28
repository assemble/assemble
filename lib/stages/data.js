/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

'use strict';

// node_modules
var async = require('async');
var file = require('fs-utils');

// Local libs
var notifier = require('./notifier');
var config = require('../config');

var events = config.plugins.events;

module.exports = function (assemble, done) {

  var fileInfo = assemble.utils.file;
  var metadata = assemble.metadata;

  var loader = function (dataFile, src, done) {
    file.getStats(src, function (err, stats) {
      if (err) { return done(err); }

      if (dataFile.mtime >= stats.mtime) {
        // if the record is newer than the file system
        // file, use the stored record
        return done(null, dataFile);
      } else {

        // load the file from the file system
        //dataFile = defaults.loadFile(dataFile, src);
        dataFile.src = src;
        dataFile.stats = file.getStatsSync(src);
        dataFile.content = file.readDataSync(src);

        // store the file
        metadata.setFile(src, dataFile, function () {
          return done(null, dataFile);
        });

      }
    });
  };

  assemble.log.debug('Running data steps');

  // setup parameters to pass to plugins
  var params = {};

  // setup a notifier to notify plugins
  var notify = notifier(assemble, params);

  // provide plugins with the list of data files
  // so they can make modifications if needed
  params.data = assemble.options.data;

  // run steps in series so we can notify plugins
  // before and after the data steps are done.
  async.series([

    // notify plugins before loading data files
    notify(events.assembleBeforeData),

    // load data files
    function (nextStep) {
      assemble.log.debug('Doing some data work here.');

      // initialize data file array if not done by a plugin
      assemble.data = assemble.data || [];

      // for each data file in params.data, load the file
      async.each(
        params.data,
        function (src, nextFile) {
          assemble.log.debug('Loading Data File', src);

          var options = {
            loader: loader
          };

          fileInfo.load(assemble, src, options, function (err, dataFile) {
            assemble.data.push(dataFile);
            nextFile();
          });
        },
        nextStep);
    },

    // notify plugins after loading data files
    notify(events.assembleAfterData)
  ],
  done);
};