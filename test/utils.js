/**
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert, Brian Woodward.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var should = require('should');
var utils = require('../lib/utils');

describe('utils', function() {
  describe('.formatExt()', function () {
    it('should prepend a . to the extension', function () {
      utils.formatExt('hbs').should.equal('.hbs');
    });
    it('should keep the extension', function () {
      utils.formatExt('.hbs').should.equal('.hbs');
    });
  });
});
