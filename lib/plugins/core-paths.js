/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

'use strict';

// node_modules
var file = require('fs-utils');
var calculateAssets = require('calculate-assets');
var async = require('async');
var _ = require('lodash');


module.exports = function(assemble) {

  var events = assemble.config.plugins.events;

  var plugin = function (params, done) {
    assemble.log.debug('\t[core plugin]: ', 'info plugin', params.event);
    assemble.log.debug('\t[params]:', params);

    // setup info on all the pages
    async.each(_.keys(assemble.pages),
      function (key, next) {
        var originalAssets = assemble.options.assets || '';
        var page = assemble.pages[key];
        var dest = page.dest || '.';
        var context        = {};

        context.assetsOrig = originalAssets || '';
        context.assets     = calculateAssets(dest, originalAssets);

        context.dirname    = file.normalizeSlash(file.dirname(dest));
        context.basename   = file.basename(dest);
        context.filename   = file.filename(dest);
        context.pagename   = context.filename;
        context.extname    = assemble.options.ext;
        context.ext        = assemble.options.ext;

        context.dest       = dest;

        page.metadata = _.merge({}, page.metadata || {}, context);
        next();
      },

    done);
  };

  plugin.options = {
    name: 'core-paths',
    description: 'Adds additional page info to the context.',
    events: [
      events.assembleAfterBuild     // after building all pages
    ]
  };

  var rtn = {};
  rtn[plugin.options.name] = plugin;
  return rtn;
};
