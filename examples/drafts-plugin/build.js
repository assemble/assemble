'use strict';

var drafts = require('./');
var smithy = require('../smithy');
var path = require('path');

/**
 * Build.
 */

smithy(__dirname)
  .use(drafts('files'))
  .build(function(err) {
    if (err) throw err;
  });
