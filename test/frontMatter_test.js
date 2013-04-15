/*global require:true */
var utils = require('../lib/assemble.js').Utils,
    expect = require('chai').expect;


describe('Reading From Files', function() {

  var frontMatter = utils.FrontMatter({});

  var simpleExpected = {
    context: {
      "foo": "bar"
    }
  };

  var complexExpected = {
    context: {
      "foo": "bar",
      "version": 2
    },
    originalContent: "---\nfoo: bar\nversion: 2\n---\n\n<span class=\"alert alert-info\">This is an alert</span>\n",
    content: "\n\n<span class=\"alert alert-info\">This is an alert</span>\n"
  };


  it("yaml file starts with --- no content", function(done) {
    var data = frontMatter.extract('./test/files/simple1.yml');
    expect(simpleExpected.context).to.deep.equal(data.context);
    done();
  });

  it("yaml file starts and ends with --- no content", function(done) {
    var data = frontMatter.extract('./test/files/simple2.yml');
    expect(simpleExpected.context).to.deep.equal(data.context);
    done();
  });

  it("yaml file starts and ends with --- has content", function(done) {
    var data = frontMatter.extract('./test/files/simple3.hbs');
    expect(simpleExpected.context).to.deep.equal(data.context);
    done();
  });

  it("hbs file with complex yaml data and content", function(done) {
    var data = frontMatter.extract("./test/files/complex.hbs");
    expect(complexExpected).to.deep.equal(data);
    done();
  });

});

describe('Reading From Strings', function() {

  var frontMatter = utils.FrontMatter({ fromFile: false });

  var simple1 = "---\nfoo: bar\n";
  var simple2 = "---\nfoo: bar\n---";
  var simple3 = "---\nfoo: bar\n---\n\n<span class=\"alert alert-info\">This is an alert</span>\n";

  var simpleExpected = {
    context: {
      foo: 'bar'
    }
  };

  var complex = "---\nfoo: bar\nversion: 2\n---\n\n<span class=\"alert alert-info\">This is an alert</span>\n";

  var complexExpected = {
    context: {
      "foo": "bar",
      "version": 2
    },
    originalContent: "---\nfoo: bar\nversion: 2\n---\n\n<span class=\"alert alert-info\">This is an alert</span>\n",
    content: "\n\n<span class=\"alert alert-info\">This is an alert</span>\n"
  };

  it("yaml string starts with --- no content", function(done) {
    var data = frontMatter.extract(simple1);
    expect(simpleExpected.context).to.deep.equal(data.context);
    done();
  });

  it("yaml string starts and ends with --- no content", function(done) {
    var data = frontMatter.extract(simple2);
    expect(simpleExpected.context).to.deep.equal(data.context);
    done();
  });

  it("yaml string starts and ends with --- has content", function(done) {
    var data = frontMatter.extract(simple3);
    expect(simpleExpected.context).to.deep.equal(data.context);
    done();
  });

  it("hbs string with complex yaml data and content", function(done) {
    var data = frontMatter.extract(complex);
    expect(complexExpected).to.deep.equal(data);
    done();
  });

});
