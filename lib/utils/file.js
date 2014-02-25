/**
 * Assemble
 *
 * Assemble <http://assemble.io>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2014 Upstage.
 * Licensed under the MIT License (MIT).
 */

// Node.js
var file = require('fs-utils');
var _ = require('lodash');
var matter = require('gray-matter');

// Local
var Component = require('../models/component');

var fileUtil = module.exports = {};

var defaults = {

  loader: function (metadata) {

    return function (component, key, done) {

      file.getStats(key, function (err, stats) {
        if (err) { return done(err); }

        if (component.mtime >= stats.mtime) {
          // if the record is newer than the file system
          // file, use the stored record
          return done(null, component);
        } else {

          // load the file from the file system
          component = defaults.loadComponent(component, key);

          // extract any front matter
          var extracted = matter(component.raw);
          component.metadata = extracted.context;
          component.content = extracted.content;

          // store the file
          metadata.setFile(key, component, function () {
            return done(null, component);
          });

        }
      });

    };

  },

  // default way to load file from the file system.
  loadComponent: function(component, src) {
    component.src = src;
    component.stats = file.getStatsSync(src);
    component.raw = file.readFileSync(src);
    return component;
  }

};

fileUtil.load = function (assemble, key, options, done) {

  var metadata = assemble.metadata;
  var opts = _.extend({}, options);

  opts.loader = opts.loader || defaults.loader(metadata);

  var component = new Component();

  metadata.getFile(key, function (err, record) {
    if (err) { return done(err); }
    if (record) {
      // if there's a saved record of the file,
      // pass it along to the loader to handle it
      return opts.loader(record.component, key, done);
    }

    // if there isn't a saved record
    // pass the empty object to the loader
    return opts.loader(component, key, done);
  });

};