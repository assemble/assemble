'use strict';

var smithy = require('../smithy');
var path = require('path');
var myth = require('myth');

/**
 * Build.
 */

smithy(__dirname)
  .use(concat)
  .build(function(err) {
    if (err) throw err;
  });

/**
 * Concat plugin.
 *
 * @param {Object} `app` Assemble instance
 */

function concat(app) {
  var files = app.views.files;
  var css = '';

  for (var file in files) {
    if ('.css' != path.extname(file)) continue;
    css += files[file].contents.toString();
    delete files[file];
  }

  css = myth(css);
  app.files.addView('index.css', {
    contents: new Buffer(css)
  });
}
