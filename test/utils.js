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
  describe('.basename()', function () {
    it('should return the basename of a file without extension:', function () {
      utils.basename('foo.hbs').should.equal('foo');
      utils.basename('foo.md').should.equal('foo');
    });

    it('should remove the extname passed as the second argument:', function () {
      utils.basename('foo.bar.baz', '.bar.baz').should.equal('foo');
    });
  });
});
