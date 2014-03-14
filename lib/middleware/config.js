/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

'use strict';

// node_modules
var file = require('fs-utils');
var boson = require('boson');
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
      assemble.options.data = file.expand(assemble.options.data || []);
      assemble.options.partials = file.expand(assemble.options.partials || assemble.options.includes || []);

      assemble.partials = assemble.options.partials || [];
      assemble.helpers = assemble.options.helpers || [];
      assemble.mixins = assemble.options.mixins || [];

      // if source is a string, use it to render
      if (_.isString(assemble.source)) {
        assemble.options.components = assemble.options.components || [];
        var component = new Component({
          raw: assemble.source || ''
        });
        assemble.options.components.push(component);
      }

      // if the engine handles layouts, load the default layout
      if (assemble.engine.handlesLayouts) {
        assemble.engine.loadDefaultLayout(next);
      } else {
        next();
      }
    },

    function (next) {
      // register any mixins with lodash
      if (!_.isEmpty(assemble.mixins)) {
        var mixins = boson(assemble.mixins, assemble);
        if (assemble.options.noconflict) {
          var prefix = assemble.options.noconflict === true ? 'fn' : assemble.options.noconflict;

          // wrapper constructor from lodash tests
          var Wrapper = function (value) {
            if (!(this instanceof Wrapper)) {
              return new Wrapper(value);
            }
            this.__wrapped__ = value;
          };

          // allows getting the value when using chaining
          Wrapper.prototype.value = function() {
            return this.__wrapped__;
          };

          // add the mixins to the Wrapper
          _.mixin(Wrapper, mixins);

          // add the Wrapper to a namespaced object
          _[prefix] = Wrapper;

        } else {
          _.mixin(mixins);
        }
      }
      next();
    },

    function (next) {
      // register any helpers
      assemble.registerHelpers(assemble.helpers, next);
    },

    // notify plugins after configuration
    notify(events.assembleAfterConfiguration)

  ],
  done);
};