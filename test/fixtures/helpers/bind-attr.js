
module.exports = function (config) {
  var Handlebars = config.Handlebars;
  var helpers = {};
  helpers['bind-attr'] = function (options) {
    options = options || {};
    options.hash = options.hash || {};

    var attrs = {};
    if (options.hash.attrs) {
      attrs = options.hash.attrs;
    } else {
      attrs = options.hash;
    }

    var results = '';
    for (var key in attrs) {
      results += ' ' + key + '="' + attrs[key] + '"';
    }
    return new Handlebars.SafeString(results);
  };

  return helpers;
};
