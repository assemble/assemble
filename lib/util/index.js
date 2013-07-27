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
