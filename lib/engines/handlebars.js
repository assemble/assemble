'use strict';

var utils = require('./utils');
var debug = require('debug')('engine:handlebars');


/**
 * Lodash support.
 */

exports.lodash = utils.fromStringRenderer('lodash');

/**
 * Lodash string support.
 */

exports.lodash.render = function (str, options, fn) {
  var engine = utils.requires.lodash || (utils.requires.lodash = require('lodash'));
  try {
    var tmpl = utils.cache(options) || utils.cache(options, engine.template(str, null, options));
    fn(null, tmpl(options).replace(/\n$/, ''));
  } catch (err) {
    fn(err);
  }
};

/**
 * Handlebars support.
 */

exports.handlebars = utils.fromStringRenderer('handlebars');

/**
 * Handlebars string support.
 */

exports.handlebars.render = function (str, options, fn) {
  var engine = utils.requires.handlebars || (utils.requires.handlebars = require('handlebars'));
  try {
    for (var partial in options.partials) {
      engine.registerPartial(partial, options.partials[partial]);
    }
    for (var helper in options.helpers) {
      engine.registerHelper(helper, options.helpers[helper]);
    }
    var tmpl = utils.cache(options) || utils.cache(options, engine.compile(str, options));
    fn(null, tmpl(options));
  } catch (err) {
    fn(err);
  }
};