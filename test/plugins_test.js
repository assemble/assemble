/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

var grunt = require('grunt');
var assemble = require('../lib/assemble');
var expect   = require('chai').expect;

describe("plugins", function() {

  describe("core", function () {
    it('should load plugins from glob', function() {
      var plugins = assemble.plugins.resolve(['./test/plugins/*one.js', ]);
      expect(plugins.length).to.equal(1);
      expect(plugins[0]).to.be.a('function');
    });

    xit('should directly load a function', function() {
      var plugin = function () {};
      var plugins = assemble.plugins.resolve([plugin]);
      expect(plugins.length).to.equal(1);
      expect(plugins[0]).to.be.a('function');
    });

    it('should load plugins from node_modules', function() {
      // mock a npm module as plugins
      var plugins = assemble.plugins.resolve(['gray-matter']);
      expect(plugins.length).to.equal(1);
    });
  });

  describe("examples: ", function () {
    describe("before :", function () {
      it('should run once and first', function() {
        var contents = grunt.file.read('./test/actual/plugin_before.html');
        expect(contents.trim()).to.equal('BEFORE TITLE 1');
      });
    });

    describe("after :", function () {
      it('should run once and last', function() {
        var contents = grunt.file.read('./test/actual/plugin_after.html');
        expect(contents).to.equal('AFTER OVERWRITE 1');
      });
    });
  });

});

