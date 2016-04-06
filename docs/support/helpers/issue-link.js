'use strict';
var issue = require('helper-issue');

module.exports = function() {
  var view = this.view;

  if (!view) {
    return issue(repo, { title: 'Documentation issue', body: 'I found an issue in the documentation' });
  }

  var context = this.context;
  var category = view.data.category;
  category = (category === 'docs' ? '' : (category + '/'));

  var title = `[DOCS]: ${view.data.title || view.key}`;
  var body = `I found an issue in [the documentation](${context.docs.content}/${category}${view.basename})`;

  return issue('assemble/assemble', { title: title, body: body });
};
