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
var file = require('fs-utils');
var _ = require('lodash');

/**
 * Generate the proper context based on where
 * assemble is in the build process
 * 
 * @param  {[type]} assemble [description]
 * @return {[type]}          [description]
 */
module.exports = function (assemble, params) {

  // setup a context on params
  params = params || {};
  params.context = {};

  // for each data file, add it to the context
  _.each(assemble.data, function (data) {
    var name = data.name || file.basename(data.src);
    params.context[name] = _.extend({}, params.context[name] || {}, data.content);
    params.context = _.extend({}, params.context, params.context[name]);
  });

  // extend the params.context and component.metadata over assemble.options
  params.context = _.extend({}, assemble.options, params.context, params.component.metadata);

  // make sure the params.context contains the metadata for the current component/page
  // add more aliases here
  params.context.component = params.context.page = params.component.metadata;

  // make sure the current assemble.context is correct for helpers
  assemble.context = params.context;
};