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

  var events = assemble.utils.middleware.events;

  var middleware = function (params, done) {
    assemble.log.debug('\t[core middleware]: ', 'info middleware', params.event);
    assemble.log.debug('\t[params]:', params);

    // setup info on all the pages
    async.each(_.keys(assemble.pages),
      function (key, next) {
        var originalAssets = assemble.config.assets || '';
        var page = assemble.pages[key];
        var dest = page.dest || '.';
        var context        = {};

        context.assetsOrig = originalAssets || '';
        context.assets     = calculateAssets(dest, originalAssets);

        context.dirname    = file.normalizeSlash(file.dirname(dest));
        context.basename   = file.basename(dest);
        context.filename   = file.filename(dest);
        context.pagename   = context.filename;
        context.extname    = assemble.config.ext;
        context.ext        = assemble.config.ext;

        context.dest       = dest;

        page.data = _.merge({}, page.data || {}, context);
        next();
      },

    done);
  };

  middleware.options = {
    name: 'core-paths',
    description: 'Adds additional page info to the context.',
    events: [
      events.assembleAfterBuild     // after building all pages
    ]
  };

  var rtn = {};
  rtn[middleware.options.name] = middleware;
  return rtn;
};
