/**
 * Adds "Untitled" to any page that doesn't have a title in the page context.
 * @author: https://github.com/adjohnson916,
 * https://github.com/assemble/assemble/pull/325#issuecomment-25510116
 * @param  {[type]}   params   [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
var untitled = function(params, callback) {
  var pages = params.context.pages;
  pages.map(function(page) {
    page.data.title = page.data.title || 'Untitled';
  });
  callback();
};

module.exports = untitled;