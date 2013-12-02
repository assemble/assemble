/**
 * Assemble <http://assemble.io>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2013 Upstage.
 * Licensed under the MIT License (MIT).
 */


// This plugin will run before each page is rendered
// and will loop over the pages collection, calling
// any registered callback function passing in
// the current page context (to be rendered) and the current
// page (from the pages collection) allowing
// additional relative page properties to be added.

var _ = require('lodash');

var options = {
  stage: 'render:pre:page'
};


var plugin = function(params, next) {
  var options = params.assemble.options;
  var pageCollectionOpts = options.pageCollection || {};
  var callbacks = pageCollectionOpts.preprocess || [];
  
  if (!_.isArray(callbacks)) {
    callbacks = [callbacks];
  }

  _.map(params.context.pages, function(page) {
    _.map(callbacks, function(callback) {
      callback(page, params.context);
    });
  });

  next();
};


// export options
plugin.options = options;
module.exports = plugin;
