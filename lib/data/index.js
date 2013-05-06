
var yfm = require('./yfm');
var markdown = require('./markdown');

module.exports = exports = {

  readYFM: function(src, opts) {
    return yfm.extract(src, opts);
  },

  readMarkdown: function(src, opts) {
    return markdown.read(src, opts);
  },

  convertMarkdown: function(src, opts) {
    return markdown.convert(src, opts);
  }

};
