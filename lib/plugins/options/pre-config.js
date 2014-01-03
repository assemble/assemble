/**
 * Assemble
 *
 * Assemble <http://assemble.io>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2013 Upstage.
 * Licensed under the MIT License (MIT).
 */

var assemble = require('../../assemble');

var options = {
  stages: [
    assemble.utils.plugins.stages.optionsBeforeConfiguration,
    assemble.utils.plugins.stages.optionsAfterConfiguration,
    'assemble:*:pages'
  ]
};

var plugin = module.exports = function(assemble) {

  assemble.registerPlugin(
    'pre-config',
    'This runs before the configration',
    options,
    function (params, next) {
     console.log('Options Plugin', params.stage);
     next();
    }
  );

};