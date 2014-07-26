/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var assert = require('assert');
var should = require('should');
var assemble = require('..');
var View = require('../lib/view/view');

describe('assemble defaultConfig', function () {
  describe('.defaultConfig()', function () {
    it('should set default values', function () {
      assemble.init();

      assemble.get('minimal config').should.be.false;
      assemble.get('env').should.equal('development');
      assemble.get('encoding').should.equal('utf8');
      assemble.get('cwd').should.equal(process.cwd());
      assemble.get('ext').should.equal('.html');
      assemble.get('data').should.be.empty;

      // Default `src` plugins
      assemble.enabled('init plugin').should.be.true;
      assemble.enabled('routes-src plugin').should.be.true;
      assemble.enabled('buffer plugin').should.be.true;
      assemble.enabled('extend-src plugin').should.be.true;
      assemble.enabled('parser plugin').should.be.true;
      assemble.enabled('drafts plugin').should.be.true;
      assemble.enabled('paginate plugin').should.be.true;

      // Default `dest` plugins
      assemble.enabled('extend-dest plugin').should.be.true;
      assemble.enabled('collections plugin').should.be.true;
      assemble.disabled('dest plugin').should.be.true;
      assemble.disabled('assets plugin').should.be.true;
      assemble.disabled('routes-dest plugin').should.be.true;
      assemble.enabled('render plugin').should.be.true;

      // View defaults
      assemble.get('view', View);
      assemble.get('view engine', 'noop');
      assemble.get('views', 'templates');
      assemble.get('delims', ['{{', '}}']);

      // assemble.get('parsers.hbs').should.exist;
      // assemble.get('parsers.md').should.exist;
      assemble.engines['.*'].should.exist;
      assemble.engines['.md'].should.exist;
      assemble.highlighter.should.exist;
    });
  });
});