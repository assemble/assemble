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

exports['Reading From Files'] = {

  setUp: function(done) {
    // setup here

    frontMatter = utils.FrontMatter({});

    this.simpleExpected = {
      context: {
        "foo": "bar"
      }
    };

    this.complexExpected = {
      context: {
        "foo": "bar",
        "version": 2
      },
      originalContent: "---\r\nfoo: bar\r\nversion: 2\r\n---\r\n\r\n<span class=\"alert alert-info\">DO IT!</span>\r\n",
      content: "\r\n\r\n<span class=\"alert alert-info\">DO IT!</span>\r\n"
    }

    done();
  },

  tearDown: function(done) {
    // clean up
    done();
  },

  "yaml file starts with --- no content": function(test) {
    var data = frontMatter.extract('./test/files/simple1.yaml');
    test.deepEqual(this.simpleExpected.context, data.context);
    test.done();
  },

  "yaml file starts and ends with --- no content": function(test) {
    var data = frontMatter.extract('./test/files/simple2.yaml');
    test.deepEqual(this.simpleExpected.context, data.context);
    test.done();
  },

  "yaml file starts and ends with --- has content": function(test) {
    var data = frontMatter.extract('./test/files/simple3.mustache');
    test.deepEqual(this.simpleExpected.context, data.context);
    test.done();
  },

  "mustache file with complex yaml data and content": function(test) {
    var data = frontMatter.extract("./test/files/complex.mustache");
    test.deepEqual(this.complexExpected, data);
    test.done();
  }

};

exports['Reading From Strings'] = {

  setUp: function(done) {
    frontMatter = utils.FrontMatter({ fromFile: false });

    this.simple1 = "---\r\nfoo: bar\r\n";
    this.simple2 = "---\r\nfoo: bar\r\n---";
    this.simple3 = "---\r\nfoo: bar\r\n---\r\n\r\n<span class=\"alert alert-info\">DO IT!</span>\r\n"

    this.simpleExpected = {
      context: {
        foo: 'bar'
      }
    };

    this.complex = "---\r\nfoo: bar\r\nversion: 2\r\n---\r\n\r\n<span class=\"alert alert-info\">DO IT!</span>\r\n"

    this.complexExpected = {
      context: {
        "foo": "bar",
        "version": 2
      },
      originalContent: "---\r\nfoo: bar\r\nversion: 2\r\n---\r\n\r\n<span class=\"alert alert-info\">DO IT!</span>\r\n",
      content: "\r\n\r\n<span class=\"alert alert-info\">DO IT!</span>\r\n"
    }
    done();
  },

  tearDown: function(done) {
    done();
  },

  "yaml string starts with --- no content": function(test) {
    var data = frontMatter.extract(this.simple1);
    test.deepEqual(this.simpleExpected.context, data.context);
    test.done();
  },

  "yaml string starts and ends with --- no content": function(test) {
    var data = frontMatter.extract(this.simple2);
    test.deepEqual(this.simpleExpected.context, data.context);
    test.done();
  },

  "yaml string starts and ends with --- has content": function(test) {
    var data = frontMatter.extract(this.simple3);
    test.deepEqual(this.simpleExpected.context, data.context);
    test.done();
  },

  "mustache string with complex yaml data and content": function(test) {
    var data = frontMatter.extract(this.complex);
    test.deepEqual(this.complexExpected, data);
    test.done();
  }
}
