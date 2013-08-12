
var frontmatter = require('assemble-front-matter');
var markdown = require('./markdown');

module.exports = exports = {

  readYFM: function(src, opts) {
    return frontmatter.extract(src, opts);
  },

  readMarkdown: function(src, opts) {
    return markdown.read(src, opts);
  },

  convertMarkdown: function(src, opts) {
    return markdown.convert(src, opts);
  }

};
