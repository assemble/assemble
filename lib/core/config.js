/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

'use strict';

var matter = require('gray-matter');
var file = require('fs-utils');
var async = require('async');
var _ = require('lodash');

// Local libs
var utils = require('../utils');
var notifier = require('./notifier');
var registerMixins = require('./mixins');
var Component = require('../models/component');
var events = utils.middleware.events;

module.exports = function(assemble, done) {

  assemble.log.debug('\t[config]:', 'initializing');

  // setup parameters to pass to middleware
  var params = {};

  // setup a notifier to notify middleware
  var notify = notifier(assemble, params);

  // run steps in series so we can notify middleware
  // before and after the config steps are done.
  async.series([

    // notify middleware before configuration
    notify(events.assembleBeforeConfiguration),

    // do some configuration setup
    function (next) {
      assemble.log.debug('\t[config]:', 'setup');
      next();
    },

    // configure the rendering engine
    function (next) {
      assemble.log.debug('\t[config]:', 'rendering engine');

      // setup the engine
      assemble.engine = assemble.render.engine.get(assemble, assemble.config.engine || assemble.defaults.engine, assemble.config);
      assemble.engine.init(next);
    },

    // config options and data
    function (next) {

      // normalize file paths
      assemble.config.partials = file.expand(assemble.config.partials || assemble.config.includes || []);
      assemble.config.components = file.expand(assemble.config.components || []);

      // expose some options to the `assemble` object
      assemble.components = assemble.config.components || [];
      assemble.partials = assemble.config.partials || [];
      assemble.helpers = assemble.config.helpers || [];
      assemble.mixins = assemble.config.mixins || [];

      // if src is a string, use it to render
      if (_.isString(assemble.src)) {
        var src = assemble.src;
        var str = '';
        var sourceObj = null;
        if (file.exists(src)) {
          // str => /path/to/my/template.hbs
          str = file.readFileSync(src);
          sourceObj = matter(str);
          sourceObj.src = src;
        } else {
          // str => "Some Template with {{foo}}."
          sourceObj = {
            orig: src
          };
        }
        var source = new Component(sourceObj);
        assemble.source = source;
      }

      // if the current engine handles layouts, load the default layout
      if (assemble.engine.handlesLayouts) {
        assemble.engine.loadDefaultLayout(next);
      } else {
        next();
      }
    },

    // register mixins with Lo-Dash
    function (next) {
      registerMixins(assemble, next);
    },

    function (next) {
      // register helpers for the current engine
      assemble.registerHelpers(assemble.helpers, next);
    },

    // notify middleware after configuration
    notify(events.assembleAfterConfiguration)

  ],
  done);
};
