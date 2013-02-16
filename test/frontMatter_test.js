/*global require:true */
var assemble = require('../lib/assemble.js'),
    expect = require('chai').expect;


describe('Reading From Files', function() {

  var frontMatter = assemble.FrontMatter({});

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
    originalContent: "---\r\nfoo: bar\r\nversion: 2\r\n---\r\n\r\n<span class=\"alert alert-info\">DO IT!</span>\r\n",
    content: "\r\n\r\n<span class=\"alert alert-info\">DO IT!</span>\r\n"
  };


  it("yaml file starts with --- no content", function(done) {
    var data = frontMatter.extract('./test/files/simple1.yaml');
    expect(simpleExpected.context).to.deep.equal(data.context);
    done();
  });

  it("yaml file starts and ends with --- no content", function(done) {
    var data = frontMatter.extract('./test/files/simple2.yaml');
    expect(simpleExpected.context).to.deep.equal(data.context);
    done();
  });

  it("yaml file starts and ends with --- has content", function(done) {
    var data = frontMatter.extract('./test/files/simple3.mustache');
    expect(simpleExpected.context).to.deep.equal(data.context);
    done();
  });

  it("mustache file with complex yaml data and content", function(done) {
    var data = frontMatter.extract("./test/files/complex.mustache");
    expect(complexExpected).to.deep.equal(data);
    done();
  });

});

describe('Reading From Strings', function() {

  var frontMatter = assemble.FrontMatter({ fromFile: false });

  var simple1 = "---\r\nfoo: bar\r\n";
  var simple2 = "---\r\nfoo: bar\r\n---";
  var simple3 = "---\r\nfoo: bar\r\n---\r\n\r\n<span class=\"alert alert-info\">DO IT!</span>\r\n";

  var simpleExpected = {
    context: {
      foo: 'bar'
    }
  };

  var complex = "---\r\nfoo: bar\r\nversion: 2\r\n---\r\n\r\n<span class=\"alert alert-info\">DO IT!</span>\r\n";

  var complexExpected = {
    context: {
      "foo": "bar",
      "version": 2
    },
    originalContent: "---\r\nfoo: bar\r\nversion: 2\r\n---\r\n\r\n<span class=\"alert alert-info\">DO IT!</span>\r\n",
    content: "\r\n\r\n<span class=\"alert alert-info\">DO IT!</span>\r\n"
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

  it("mustache string with complex yaml data and content", function(done) {
    var data = frontMatter.extract(complex);
    expect(complexExpected).to.deep.equal(data);
    done();
  });

});
