/**
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert, Brian Woodward.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var path = require('path');
var should = require('should');
var isAbsolute = require('is-absolute');
var assemble = require('..');
var app;

describe('assemble cwd', function () {
  beforeEach(function () {
    app = assemble.init();
  });

  describe('.cwd()', function () {
    it('should return the cwd', function () {
      app.cwd.toLowerCase().should.equal(process.cwd().toLowerCase());
    });

    it('should return the cwd with appended arguments', function () {
      var expected = path.join(process.cwd(), 'path/to/something');
      path.join(app.cwd, 'path', 'to', 'something').should.equal(expected);
    });
    it('should return the modified cwd with appended arguments', function () {
      var expected = path.join(process.cwd(), 'test/fixtures/templates/pages');
      app.option('cwd', process.cwd() + '/test/fixtures');
      isAbsolute(app.option('cwd')).should.be.true;
      path.join(app.cwd, 'templates', 'pages').should.equal(expected);
    });
  });
});
