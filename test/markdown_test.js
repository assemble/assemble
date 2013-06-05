var assembleData = require('../lib/data');
    expect = require('chai').expect;

describe('Converting Markdown files', function() {

  var opts = {
    gfm: true,
    highlight: 'auto'
  };

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

  describe('Using new style', function() {

    it("convert markdown string", function(done) {
      var data = assembleData.convertMarkdown(simple, opts);
      //expect(data).to.equal(simpleExpected);
      done();
    });

    it("read markdown file", function(done) {
      var data = assembleData.readMarkdown('./test/templates/pages/simple1.md', opts);
      expect(data).to.equal(simpleExpected);
      done();
    });

    it("convert markdown file with code highlighting", function(done) {
      var data = assembleData.readMarkdown('./test/templates/pages/complex1.md', opts);
      //console.log(data);
      //expect(complexExpected).to.deep.equal(data);
      done();
    });
  });


});
