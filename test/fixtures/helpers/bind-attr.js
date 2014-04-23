
var _ = require('lodash');

module.exports = function (config) {
  var Handlebars = config.Handlebars;
  var helpers = {};
  helpers['bind-attr'] = function (options) {
    options = options || {};
    options.hash = options.hash || {};

    var attrs = options.hash.attrs || _.omit(options.hash || {}, ['attrs']) || {};

    var results = '';
    for (var key in attrs) {
      results += ' ' + key + '="' + attrs[key] + '"';
    }
    return new Handlebars.SafeString(results);
  };

  return helpers;
};
