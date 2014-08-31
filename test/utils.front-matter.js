/**
 * assemble <https://github.com/assemble/assemble>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

'use strict';

var should = require('should');
var matter = require('gray-matter');


describe('Read from strings:', function () {
  it('should extract YAML front matter directly from a string when with "read: false" is defined', function () {
    var actual = matter('---\nfoo: bar\n---');
    actual.should.have.property('data');
    actual.should.have.property('content');
    actual.should.have.property('orig');
    actual.data.should.have.property('foo');
    actual.data.foo.should.equal('bar');
  });

  it('should extract YAML front matter and content directly from a string when with "read: false" is defined', function () {
    var fixture = '---\nfoo: bar\nversion: 2\n---\n\n<span class="alert alert-info">This is an alert</span>\n';
    var actual = matter(fixture);
    actual.should.have.property('data');
    actual.should.have.property('content');
    actual.should.have.property('orig');
    actual.data.should.have.property('foo');
    actual.data.foo.should.equal('bar');
  });

  it('should parse YAML front matter.', function () {
    var actual = matter.read('test/fixtures/front-matter/lang-yaml.md');
    actual.data.title.should.equal('YAML');
    actual.should.have.property('data');
    actual.should.have.property('content');
    actual.should.have.property('orig');
  });

  it('should detect YAML as the language with no language defined after the first fence.', function () {
    var actual = matter.read('test/fixtures/front-matter/autodetect-no-lang.md', {
      autodetect: true
    });
    actual.data.title.should.equal('autodetect-no-lang');
    actual.should.have.property('data');
    actual.should.have.property('content');
    actual.should.have.property('orig');
  });

  it('should detect YAML as the language.', function () {
    var actual = matter.read('test/fixtures/front-matter/autodetect-yaml.md', {
      autodetect: true
    });
    actual.data.title.should.equal('autodetect-yaml');
    actual.should.have.property('data');
    actual.should.have.property('content');
    actual.should.have.property('orig');
  });
});

