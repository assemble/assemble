/*global require:true */
var utils = require('../lib/assemble.js').Utils,
    expect = require('chai').expect;

describe('Converting Markdown Files', function() {

  var markdown = utils.Markdown({
    gfm: true,
    highlight: 'auto'
  });

  var simple = "## Some Markdown\n\n" +
                " - one\n" +
                " - two\n" +
                " - three\n\n" +
                "[Click here](http://github.com)";


  var simpleExpected = "<h2>Some Markdown</h2>\n" +
                       "<ul>\n" +
                       "<li>one</li>\n" +
                       "<li>two</li>\n" +
                       "<li>three</li>\n" +
                       "</ul>\n" +
                       "<p><a href=\"http://github.com\">Click here</a></p>\n";

  it("convert markdown string", function(done) {
    var data = markdown.convert(simple);
    //expect(data).to.equal(simpleExpected);
    done();
  });

  it("read markdown file", function(done) {
    var data = markdown.read('./test/files/simple1.md');
    expect(data).to.equal(simpleExpected);
    done();
  });

  it("convert markdown file with code highlighting", function(done) {
    var data = markdown.read('./test/files/complex1.md');
    //console.log(data);
    //expect(complexExpected).to.deep.equal(data);
    done();
  });

});

