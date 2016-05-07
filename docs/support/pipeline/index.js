'use strict';

var pipeline = module.exports = require('export-files')(__dirname);
pipeline.browserSync = require('browser-sync').create();
pipeline.extname = require('gulp-extname');
pipeline.ghPages = require('gulp-gh-pages');
pipeline.ignore = require('gulp-ignore');
pipeline.drafts = require('gulp-drafts');
