'use strict';

var assemble = require('assemble');
var themes = require('assemble-themes');

assemble.task('scripts', function () {
  assemble.src('foo/**/index.less')
    .pipe(themes()) // adds theme variables to the context for rte
    .pipe(assemble.dest(':dest/:css/:theme.css'));
});