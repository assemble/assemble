/**
 * Assemble
 *
 * Assemble <http://assemble.io>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2013 Upstage.
 * Licensed under the MIT License (MIT).
 */

var utils = require('../utils');

var properties = {
  src: ''
};

var Page = module.exports = utils.model.inherit(
      require('./component'),
      utils.model.createPropertiesFromObject(properties));

