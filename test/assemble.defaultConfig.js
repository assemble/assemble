/**
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var assert = require('assert');
var should = require('should');
var assemble = require('..');

describe('assemble defaultConfig', function () {
  var site = null;
  beforeEach(function () {
    site = assemble.createInst();
  });

  describe('.defaultConfig()', function () {
    it('should set default values', function () {
      // site.init();

      site.enabled('minimal config').should.be.false;
      site.get('env').should.equal('development');
      site.get('encoding').should.equal('utf8');
      site.option('cwd').should.equal(process.cwd());
      site.option('ext').should.equal('.hbs');
      // site.get('data').should.be.empty;

      // Default `src` plugins
      site.enabled('src:init plugin').should.be.true;
      site.enabled('src:extend plugin').should.be.true;
      site.enabled('src:drafts plugin').should.be.true;
      site.enabled('src:assets plugin').should.be.true;
      site.enabled('src:paginate plugin').should.be.true;

      // Default `dest` plugins
      site.enabled('dest:extend plugin').should.be.true;
      site.enabled('dest:collections plugin').should.be.true;
      site.enabled('dest:paths plugin').should.be.true;
      site.enabled('dest:render plugin').should.be.true;

      // View defaults
      site.get('view engine', 'noop');
      site.get('views', 'templates');
      site.get('delims', ['{{', '}}']);

      site.engines['.*'].should.exist;
      site.engines['.hbs'].should.exist;
    });
  });
});
