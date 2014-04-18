

var koalas = require('koalas');
var _ = require('lodash');

module.exports = function (config) {
  var Handlebars = config.Handlebars;
  var helpers = {};
  helpers['koalas'] = function () {
    var results = koalas.apply(null, arguments).value();
    return results;
  };

  return helpers;
};
