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
      assemble.get('view').should.equal(View);
      assemble.get('view engine').should.equal('noop');
      assemble.get('views').should.equal('templates');
      assemble.get('delims').should.eql(['{{', '}}']);
      assemble.get('data').should.be.empty;
      assemble.get('front matter').should.be.empty;

      assemble.enabled('init plugin').should.be.true;
      assemble.enabled('routes plugin').should.be.true;
      assemble.enabled('buffer plugin').should.be.true;
      assemble.enabled('extend plugin').should.be.true;
      assemble.enabled('parser plugin').should.be.true;
      assemble.enabled('drafts plugin').should.be.true;
      assemble.enabled('paginate plugin').should.be.true;

      // assemble.get('parsers.hbs').should.exist;
      // assemble.get('parsers.md').should.exist;
      assemble.engines['.*'].should.exist;
      assemble.engines['.md'].should.exist;
      assemble.highlighter.should.exist;
    });
  });
});