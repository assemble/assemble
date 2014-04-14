/**
 * Assemble
 *
 * Assemble <http://assemble.io>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2014 Assemble.
 * Licensed under the MIT License (MIT).
 */

// node_modules
var _ = require('lodash');

// local modules
var data = require('../utils').data;

/**
 * Add context functions to be used on params
 * and assemble is in the build process
 *
 * When used inside a plugin... use `params.context`.
 * When used inside a helper... use `assemble.context()`.
 */
module.exports = function (assemble, params) {

  // setup a context on params and assemble
  params = params || {};
  params.context = {};

  assemble.context = function () {

    // first build the params.context based on any global assemble.data
    // plus the current params.context (in case a plugin has updated the context then called `assemble.context()`
    params.context = _.merge({}, assemble.data, params.context);

    // merge the params.context and component.metadata over assemble.options
    params.context = _.merge({}, assemble.options, params.context, (params.component ? params.component.metadata : {}));

    // make sure the params.context contains the metadata for the current component/page
    // add more aliases here
    if (params.component) {
      params.context.component = params.context.page = params.component.metadata;
    }

    return data.process(params.context);
  };

  params.context = assemble.context();

};

module.exports.stub = function (assemble) {
  var params = {};
  return function () {
    module.exports(assemble, params);
    return params.context;
  };
};
