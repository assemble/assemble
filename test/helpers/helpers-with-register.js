/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */


module.exports.register = function(Handlebars, options) {
  'use strict';

  Handlebars.registerHelper('foo', function(msg) {
    return '<!-- ' + msg + ' -->';
  });

  Handlebars.registerHelper('opt', function(key) {
    return options[key] || '';
  });

};
