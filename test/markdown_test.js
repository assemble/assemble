/*global require:true */
var utils = require('../lib/utils.js');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports['Converting Markdown Files'] = {

  setUp: function(done) {
    // setup here

    markdown = utils.Markdown({
      gfm: true,
      highlight: 'auto'
    });

    this.simple = "## Some Markdown\r\n\r\n" +
                  " - one\r\n" +
                  " - two\r\n" +
                  " - three\r\n\r\n" +
                  "[Click here](http://www.google.com)";


    this.simpleExpected = "<h2>Some Markdown</h2>\n" +
                          "<ul>\n" +
                          "<li>one</li>\n" +
                          "<li>two</li>\n" +
                          "<li>three</li>\n" +
                          "</ul>\n" +
                          "<p><a href=\"http://www.google.com\">Click here</a>\n" +
                          "</p>\n";

    done();
  },

  tearDown: function(done) {
    // clean up
    done();
  },

  "read markdown file": function(test) {
    var data = markdown.read('./test/files/simple1.md');
    test.deepEqual(this.simpleExpected, data);
    test.done();
  },

  "convert markdown string": function(test) {
    var data = markdown.convert(this.simple);
    test.deepEqual(this.simpleExpected, data);
    test.done();
  },

  "convert markdown file with code highlighting": function(test) {
    var data = markdown.read('./test/files/complex1.md');
    console.log(data);
    //test.deepEqual(this.complexExpected, data);
    test.done();
  }

};

