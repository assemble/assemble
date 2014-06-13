/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

var path = require('path');

module.exports.register = function (Handlebars) {
  'use strict';

  Handlebars.registerHelper('rel', function(context) {
    var newDest      = this.dest;
    var destDirname  = path.dirname(context);
    var relativePath = path.relative(path.resolve(destDirname), path.resolve(newDest));

    return relativePath.replace(/\\/g, '/');
  });
};
