/**
 * Assemble <http://site.io>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var matter = require('gray-matter');
var should = require('should');


describe('assemble front-matter', function() {
  describe('reading from files', function() {
    var simpleExpected = {data: {'foo': 'bar'}};
    var complexExpected = {
      original: '---\nfoo: bar\nversion: 2\ncategories:\n- pages\ntags:\n- tests\n- examples\n- complex\n---\n\n<div class="alert alert-info">This is an alert</div>\n',
      content: '\n\n<div class="alert alert-info">This is an alert</div>\n',
      data: {
        foo: 'bar',
        version: 2,
        categories: ['pages'],
        tags: ['tests', 'examples', 'complex']
      }
    };

    it('yaml file starts and ends with --- has content', function() {
      var page = matter.read('./test/fixtures/yfm/yfm.hbs');
      simpleExpected.data.should.eql(page.data);
    });

    it('hbs file with complex yaml data and content', function() {
      var page = matter.read('./test/fixtures/yfm/complex.hbs');
      complexExpected.should.eql(page);
    });

  });

  describe('reading from strings', function() {
    var simple1 = '---\nfoo: bar\n';
    var simple2 = '---\nfoo: bar\n---';
    var simple3 = '---\nfoo: bar\n---\n\n<div class="alert alert-info">This is an alert</div>\n';

    var simpleExpected = {
      data: {foo: 'bar'}
    };

    var complex = '---\nfoo: bar\nversion: 2\n---\n\n<div class="alert alert-info">This is an alert</div>\n';

    var complexExpected = {
      original: '---\nfoo: bar\nversion: 2\n---\n\n<div class="alert alert-info">This is an alert</div>\n',
      content: '\n\n<div class="alert alert-info">This is an alert</div>\n',
      data: {
        'foo': 'bar',
        'version': 2
      }
    };

    it('yaml string starts with --- no content', function() {
      var page = matter(simple1);
      ({}).should.eql(page.data);
    });

    it('yaml string starts and ends with --- no content', function() {
      var page = matter(simple2);
      simpleExpected.data.should.eql(page.data);
    });

    it('yaml string starts and ends with --- has content', function() {
      var page = matter(simple3);
      simpleExpected.data.should.eql(page.data);
    });

    it('hbs string with complex yaml data and content', function() {
      var page = matter(complex);
      complexExpected.should.eql(page);
    });

  });
});
