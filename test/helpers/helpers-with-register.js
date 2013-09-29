/**
 * Assemble <http://assemble.io>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2013 Upstage.
 * Licensed under the MIT License (MIT).
 */

module.exports.register = function(Handlebars, options) {

  Handlebars.registerHelper('foo2', function(msg) {
    return '<!-- foo2 -->\n<!-- ' + msg + ' -->';
  });

  Handlebars.registerHelper('opt', function(key) {
    return options[key] || '';
  });

};
