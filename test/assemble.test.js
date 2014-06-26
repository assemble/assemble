/*!
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014 Assemble, contributors.
 * Licensed under the MIT License
 */
'use strict';

var expect = require('chai').expect;
var assemble = require('../');

describe('when foo is passed:', function () {
  it('should convert foo to bar.', function () {
    var actual = 'bar';
    var expected = 'bar';
    expect(assemble(actual)).to.eql(expected);
  });
});