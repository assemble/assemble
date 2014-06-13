
// list of functions to do pre processing on the pages
// in the pages collection

var relative = require('relative');

module.exports = [

  // add an isCurrentPage flag to the page if the dest matches
  function isCurrentPage(page, context) {
    page.isCurrentPage = (page.dest === context.page.dest ? true : false);
  },


  // add a relative link from the "current page" to the
  // page in the collection
  function relativeLink(page, context) {
    page.relativeLink = relative(context.page.dest, page.dest);
  }
];