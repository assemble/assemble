/*global require:true */
var assembleData = require('../lib/data'),
    expect = require('chai').expect;


describe('Reading From Files', function() {


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
    var data = assembleData.readYFM('./test/templates/pages/simple1.yml');
    expect(simpleExpected.context).to.deep.equal(data.context);
    done();
  });

  it("yaml file starts and ends with --- no content", function(done) {
    var data = assembleData.readYFM('./test/templates/pages/simple2.yml');
    expect(simpleExpected.context).to.deep.equal(data.context);
    done();
  });

  it("yaml file starts and ends with --- has content", function(done) {
    var data = assembleData.readYFM('./test/templates/pages/simple3.hbs');
    expect(simpleExpected.context).to.deep.equal(data.context);
    done();
  });

  it("hbs file with complex yaml data and content", function(done) {
    var data = assembleData.readYFM("./test/templates/pages/complex.hbs");
    expect(complexExpected).to.deep.equal(data);
    done();
  });

});

describe('Reading From Strings', function() {

  var opts = { fromFile: false };

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
    var data = assembleData.readYFM(simple1, opts);
    expect(simpleExpected.context).to.deep.equal(data.context);
    done();
  });

  it("yaml string starts and ends with --- no content", function(done) {
    var data = assembleData.readYFM(simple2, opts);
    expect(simpleExpected.context).to.deep.equal(data.context);
    done();
  });

  it("yaml string starts and ends with --- has content", function(done) {
    var data = assembleData.readYFM(simple3, opts);
    expect(simpleExpected.context).to.deep.equal(data.context);
    done();
  });

  it("hbs string with complex yaml data and content", function(done) {
    var data = assembleData.readYFM(complex, opts);
    expect(complexExpected).to.deep.equal(data);
    done();
  });

});
