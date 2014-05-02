/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */
'use strict';

// node_modules
var _ = require('lodash');

// local modules
var data = require('./data');

/**
 * Add context functions to be used on params
 * and assemble is in the build process
 *
 * When used inside a middleware... use `params.context`.
 * When used inside a helper... use `assemble.context()`.
 */
module.exports = function (assemble, params) {

  // setup a context on params and assemble
  params = params || {};
  params.context = {};

  assemble.context = function () {

    // first build the params.context based on any global assemble.data
    // plus the current params.context (in case a middleware has updated the context then called `assemble.context()`
    params.context = _.merge({}, assemble.data, params.context);

    // merge the params.context and page.data over assemble.config
    params.context = _.merge({}, assemble.config, params.context, (params.page ? params.page.data : {}));

    // make sure the params.context contains the data for the current page
    // add more aliases here
    if (params.page) {
      params.context.page = params.page.data;
    }

    var omitted = _.omit(params.context, ['grunt', 'orig', 'pages']);
    var processed = data.process(omitted, params.context, { imports: { grunt: assemble.config.grunt } });
    params.context = _.merge({}, params.context, processed);
    return params.context;
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
