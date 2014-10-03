/**
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var matter = require('gray-matter');
var should = require('should');
var assemble = require('..');
var utils = require('../lib/utils');
var normalizeFile = require('../lib/utils/normalize-file');

describe('assemble normalize-file', function() {
  var site = null;
  var vinylProps = ['cwd', 'base', 'stat', '_contents'];
  beforeEach(function () {
    site = assemble.createInst();
  });

  describe('vinyl files', function() {
    it('should add additional properties with no options', function() {
      var file = {
        path: 'test-file.hbs',
        content: '---\ntitle: Test File\n---\nFile: {{title}}\n'
      };
      var normalized = normalizeFile.call(site, file);
      // console.log('normalized', utils.debug(normalized));
      vinylProps.forEach(function (prop) {
        normalized.should.have.property(prop);
      });
    });
    it('should add additional properties with options', function() {
      var file = {
        path: 'test-file.hbs',
        content: '---\ntitle: Test File\n---\nFile: {{title}}\n'
      };
      var options = {};
      var normalized = normalizeFile.call(site, file, options);
      // console.log('normalized', utils.debug(normalized));
      vinylProps.forEach(function (prop) {
        normalized.should.have.property(prop);
      });
    });
  });

  describe('assemble files', function() {
    it('should only have additional assemble properties with no options', function() {
      var file = {
        path: 'test-file.hbs',
        content: '---\ntitle: Test File\n---\nFile: {{title}}\n'
      };
      var normalized = normalizeFile.call(site, file, false);
      // console.log('normalized', utils.debug(normalized));
      vinylProps.forEach(function (prop) {
        normalized.should.not.have.property(prop);
      });
    });
    it('should only have additional assemble properties with options', function() {
      var file = {
        path: 'test-file.hbs',
        content: '---\ntitle: Test File\n---\nFile: {{title}}\n'
      };
      var options = {};
      var normalized = normalizeFile.call(site, file, options, false);
      // console.log('normalized', utils.debug(normalized));
      vinylProps.forEach(function (prop) {
        normalized.should.not.have.property(prop);
      });
    });

  });
});
