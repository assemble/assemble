/**
 * Assemble <http://assemble.io>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2013 Upstage.
 * Licensed under the MIT License (MIT).
 */

var _ = require('lodash');
var collection = require('./collection');

var filterOptionsProperties = [
  'defaultLayout',
  'initializeEngine',
  'registerFunctions',
  'registerPartial'
];

module.exports = exports = {
  collection: collection,
  filterProperties: function(opts) {
    return _.omit(opts, filterOptionsProperties);
  }
};
