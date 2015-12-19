/**
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert, Brian Woodward.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var assert = require('assert');
var should = require('should');
var assemble = require('..');

describe('assemble defaultConfig', function () {
  var site = null;
  beforeEach(function () {
    site = assemble.init();
  });

  describe('.defaultConfig()', function () {
    it('should set default values', function () {
      // Default options
      site.option('env').should.equal('dev');
      site.option('cwd').should.equal(process.cwd());
      site.option('ext').should.equal('.hbs');
      // views
      site.option('view engine', 'noop');
      site.option('views', 'templates');
      site.option('delims', ['{{', '}}']);
    });

    it('should enable some plugins by default', function () {
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
    });

    it('should disable some boolean options by default', function () {
      site.enabled('minimal config').should.be.false;
      site.disabled('minimal config').should.be.true;
    });
  });
});
