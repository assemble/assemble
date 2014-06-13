/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */

var matter = require('gray-matter');
var expect = require('chai').expect;



describe('Reading From Files', function() {

  var simpleExpected = {
    data: {
      "foo": "bar"
    }
  };

  var complexExpected = {
    original: "---\nfoo: bar\nversion: 2\ncategories:\n- pages\ntags:\n- tests\n- examples\n- complex\n---\n\n<div class=\"alert alert-info\">This is an alert</div>\n",
    content: "\n\n<div class=\"alert alert-info\">This is an alert</div>\n",
    data: {
      "foo": "bar",
      "version": 2,
      "categories": [
        "pages"
      ],
      "tags": [
        "tests",
        "examples",
        "complex"
      ]
    }
  };

  it("yaml file starts and ends with --- has content", function(done) {
    var page = matter.read('./test/fixtures/mocha/yfm.hbs');
    expect(simpleExpected.data).to.deep.equal(page.data);
    done();
  });

  it("hbs file with complex yaml data and content", function(done) {
    var page = matter.read("./test/fixtures/mocha/complex.hbs");
    expect(complexExpected).to.deep.equal(page);
    done();
  });

});

describe('Reading From Strings', function() {
  var simple1 = "---\nfoo: bar\n";
  var simple2 = "---\nfoo: bar\n---";
  var simple3 = "---\nfoo: bar\n---\n\n<div class=\"alert alert-info\">This is an alert</div>\n";

  var simpleExpected = {
    data: {
      foo: 'bar'
    }
  };

  var complex = "---\nfoo: bar\nversion: 2\n---\n\n<div class=\"alert alert-info\">This is an alert</div>\n";

  var complexExpected = {
    original: "---\nfoo: bar\nversion: 2\n---\n\n<div class=\"alert alert-info\">This is an alert</div>\n",
    content: "\n\n<div class=\"alert alert-info\">This is an alert</div>\n",
    data: {
      "foo": "bar",
      "version": 2
    }
  };

  it("yaml string starts with --- no content", function(done) {
    var page = matter(simple1);
    expect({}).to.deep.equal(page.data);
    done();
  });

  it("yaml string starts and ends with --- no content", function(done) {
    var page = matter(simple2);
    expect(simpleExpected.data).to.deep.equal(page.data);
    done();
  });

  it("yaml string starts and ends with --- has content", function(done) {
    var page = matter(simple3);
    expect(simpleExpected.data).to.deep.equal(page.data);
    done();
  });

  it("hbs string with complex yaml data and content", function(done) {
    var page = matter(complex);
    expect(complexExpected).to.deep.equal(page);
    done();
  });

});
