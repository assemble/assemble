
// list of functions to do pre processing on the pages
// in the pages collection

var path = require('path');

module.exports = [
  
  // add an isActive flag to the page if the dest matches
  function isActive(page, context) {
    page.isActive = (page.dest === context.page.dest ? true : false);
  },

  // add a relative link from the "current page" to the
  // page in the collection
  function relativeLink(page, context) {
    var relativePath = path.relative(path.dirname(context.page.dest), path.dirname(page.dest));
    relativePath = path.join(relativePath, path.basename(page.dest));
    page.relativeLink = relativePath.replace(/\\/g, '/');
  }
];