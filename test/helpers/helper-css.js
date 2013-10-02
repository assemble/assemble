/**
 * Assemble <http://assemble.io>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2013 Upstage.
 * Licensed under the MIT License (MIT).
 */

module.exports.register = function(Handlebars, options) {
  var path = require('path');
  var Utils = require('./utils');

  Handlebars.registerHelper("css", function(context) {
    if (!Array.isArray(context)) {context = [context]; }
    return new Handlebars.SafeString(context.map(function(item) {
      var ext = Utils.getext(item);
      var css = '<link rel="stylesheet" href="' + options.assets + '/css/' + item + '">';
      var less = '<link rel="stylesheet/less" href="' + options.assets + '/less/' + item + '">';
      switch (ext) {
        case "less":
          return less;
        case "css":
          return css;
        default:
          return css;
      }
    }).join("\n"));
  });
};
