/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

'use strict';

// node_modules
var plasma = require('plasma');
var async = require('async');
var _ = require('lodash');

// Local libs
var notifier = require('./notifier');
var config = require('../config');

var events = config.plugins.events;

module.exports = function (assemble, done) {

  assemble.log.debug('\t[data]:', 'running steps');

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
      assemble.log.debug('\t[data]:', 'loading data');

      // initialize data if not pre-loaded by a plugin
      assemble.data = assemble.data || {};

      // Load data from options.data.
      var data = plasma.load({ name: ':basename', src: params.data }).data;
      assemble.data = _.merge(assemble.data, data || {});

      // for each data file in params.data, load the file
      //async.each(params.data, function (src, nextFile) {
      //  assemble.log.debug('\t[data]:', 'loading', src);
      //  assemble.data.push(Component.readFile(src, 'data'));
      //  nextFile();
      //},
      //nextStep);

      nextStep();
    },

    // notify plugins after loading data files
    notify(events.assembleAfterData)
  ],
  done);
};
