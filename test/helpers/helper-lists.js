/**
 * Assemble <http://assemble.io>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2013 Upstage.
 * Licensed under the MIT License (MIT).
 */

var Utils = require('./utils');
var _ = require('lodash');

module.exports.register = function(Handlebars, options) {

  Handlebars.registerHelper("_link", function(url, text, linkClass) {
    url = Handlebars.Utils.escapeExpression(url);
    text = Handlebars.Utils.escapeExpression(text);
    if (_.isUndefined(linkClass)) {
      linkClass = "";
    }
    var md = '[' + text + '](' + url + ')';
    var html = '<a class="' + linkClass + '" href="' + url + '" title="' + text + '">' + text + '</a>';
    var result = Utils.switchOutput(options.ext, md, html);
    return new Handlebars.SafeString(result);
  });


  Handlebars.registerHelper("ul", function(context, options) {
    return ("<ul " + (Utils.parseAttributes(options.hash)) + ">") + context.map(function(item) {
      return "<li>" + (options.fn(item)) + "</li>";
    }).join("\n") + "</ul>";
  });


  Handlebars.registerHelper("ol", function(context, options) {
    return ("<ol " + (Utils.parseAttributes(options.hash)) + ">") + context.map(function(item) {
      return "<li>" + (options.fn(item)) + "</li>";
    }).join("\n") + "</ol>";
  });

};
