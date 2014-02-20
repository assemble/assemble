/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

'use strict';

// node_modules
var async = require('async');
var _ = require('lodash');

// Local libs
var notifier = require('./notifier');
var config = require('../config');
var Component = require('../models/component');

var events = config.plugins.events;

module.exports = function(assemble, done) {

  assemble.log.debug('Running config steps');

  // setup parameters to pass to plugins
  var params = {};

  // setup a notifier to notify plugins
  var notify = notifier(assemble, params);

  // run steps in series so we can notify plugins
  // before and after the config steps are done.
  async.series([

    // notify plugins before configuration
    notify(events.assembleBeforeConfiguration),

    // do some configuration setup
    function (next) {
      assemble.log.debug('Doing some configuration work here.');

      // setup the engine
      assemble.engine = assemble.render.engine.get(
        assemble, 
        assemble.options.engine || assemble.defaults.engine, 
        assemble.options
      );

      // normalize file paths
      assemble.options.data = assemble.utils.resolve(assemble.options.data || []);

      // if source is a string, use it to render
      if (_.isString(assemble.source)) {
        assemble.options.components = assemble.options.components || [];
        var component = new Component({
          raw: assemble.source || ''
        });
        assemble.options.components.push(component);
      }

      next();
    },

    // notify plugins after configuration
    notify(events.assembleAfterConfiguration)

  ],
  done);
};