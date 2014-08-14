'use strict';

var assemble = require('assemble');
var themes = require('assemble-themes');

site.task('scripts', function () {
  site.src('foo/**/index.less')
    .pipe(themes()) // adds theme variables to the context for rte
    .pipe(site.dest(':dest/:css/:theme.css'));
});