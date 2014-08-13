/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var should = require('should');
var Assemble = require('..');


describe('assemble init', function () {
  describe('.template()', function () {
    var assemble = null;
    beforeEach(function () {
      assemble = Assemble.create();
    });

    it('should create new template type methods on Assemble.prototype.', function () {
      assemble.template('monkey', {plural: 'monkies'});
      should.exist(assemble.monkey);
      should.exist(assemble.monkies);
      should.exist(assemble.cache.monkies);
    });

    it('should create new template type methods on Assemble.prototype for layout types.', function () {
      assemble.template('lion', {plural: 'lions', isLayout: true});
      should.exist(assemble.lion);
      should.exist(assemble.lions);
      should.exist(assemble.cache.lions);
    });
  });
});