/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

'use strict';

var assemble = require('../../assemble');

var options = {
  stages: [
    // assemble.config.plugins.stages.optionsBeforeConfiguration,
    // assemble.config.plugins.stages.optionsAfterConfiguration,
    // 'assemble:*:pages'
  ]
};

var plugin = module.exports = function(assemble) {

  assemble.registerPlugin('pre-config', 'This runs before the configration', options, function (params, next) {
     console.log('Options Plugin', params.stage);
     next();
    }
  );
};