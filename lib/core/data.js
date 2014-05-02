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
var utils = require('../utils');

var events = utils.middleware.events;

module.exports = function (assemble, done) {

  assemble.log.debug('\t[data]:', 'running steps');

  // setup parameters to pass to middleware
  var params = {};

  // setup a notifier to notify middleware
  var notify = notifier(assemble, params);

  // provide middleware with the list of data files
  // so they can make modifications if needed
  params.data = assemble.config.data;

  // run steps in series so we can notify middleware
  // before and after the data steps are done.
  async.series([

    // notify middleware before loading data files
    notify(events.assembleBeforeData),

    // load data files
    function (nextStep) {
      assemble.log.debug('\t[data]:', 'loading data');

      // initialize data if not pre-loaded by a middleware
      assemble.data = assemble.data || {};

      // Load data from options.data.
      var data = plasma(params.data);
      assemble.data = _.merge(assemble.data, data || {});
      nextStep();
    },

    // notify middleware after loading data files
    notify(events.assembleAfterData)
  ],
  done);
};
