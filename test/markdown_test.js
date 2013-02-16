/*global require:true */
var assemble = require('../lib/assemble.js'),
    expect = require('chai').expect;

describe('Converting Markdown Files', function() {

  var markdown = assemble.Markdown({
    gfm: true,
    highlight: 'auto'
  });

  var simple = "## Some Markdown\r\n\r\n" +
                " - one\r\n" +
                " - two\r\n" +
                " - three\r\n\r\n" +
                "[Click here](http://www.google.com)";


  var simpleExpected = "<h2>Some Markdown</h2>\n" +
                        "<ul>\n" +
                        "<li>one</li>\n" +
                        "<li>two</li>\n" +
                        "<li>three</li>\n" +
                        "</ul>\n" +
                        "<p><a href=\"http://www.google.com\">Click here</a>\n</p>\n";

  it("read markdown file", function(done) {
    var data = markdown.read('./test/files/simple1.md');
    expect(data).to.equal(simpleExpected);
    done();
  });

  it("convert markdown string", function(done) {
    var data = markdown.convert(simple);
    //expect(data).to.equal(simpleExpected);
    done();
  });

  it("convert markdown file with code highlighting", function(done) {
    var data = markdown.read('./test/files/complex1.md');
    //console.log(data);
    //expect(complexExpected).to.deep.equal(data);
    done();
  });

});

