/**
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert, Brian Woodward.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var should = require('should');
var assemble = require('..');

describe('assemble run', function () {
  var site = null;
  beforeEach(function() {
    site = assemble.init();
  });

  describe('site.run()', function () {
    it('should run a task', function (done) {
      site.task('foo', function () {
        done();
      });
      site.run(['foo']);
    });
  });
});
