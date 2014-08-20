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
var View = require('../lib/view/view');

describe('assemble defaultConfig', function () {
  var site = null;
  beforeEach(function () {
    site = assemble.create();
  });

  describe('.defaultConfig()', function () {
    it('should set default values', function () {
      site.init();

      site.get('minimal config').should.be.false;
      site.get('env').should.equal('development');
      site.get('encoding').should.equal('utf8');
      site.get('cwd').should.equal(process.cwd());
      site.get('ext').should.equal('.html');
      // site.get('data').should.be.empty;

      // Default `src` plugins
      site.enabled('init plugin').should.be.true;
      site.enabled('src-routes plugin').should.be.true;
      site.enabled('buffer plugin').should.be.true;
      site.enabled('extend-src plugin').should.be.true;
      site.enabled('parser plugin').should.be.true;
      site.enabled('drafts plugin').should.be.true;
      site.enabled('assets plugin').should.be.true;
      site.enabled('paginate plugin').should.be.true;

      // Default `dest` plugins
      site.enabled('extend-dest plugin').should.be.true;
      site.enabled('collections plugin').should.be.true;
      site.enabled('dest plugin').should.be.true;
      site.enabled('dest-routes plugin').should.be.true;
      site.enabled('render plugin').should.be.true;

      // View defaults
      site.get('view', View);
      site.get('view engine', 'noop');
      site.get('views', 'templates');
      site.get('delims', ['{{', '}}']);

      site.get('parsers.hbs').should.exist;
      site.get('parsers.md').should.exist;

      site.engines['.*'].should.exist;
      site.engines['.md'].should.exist;
      site.highlighter.should.exist;
    });
  });
});
