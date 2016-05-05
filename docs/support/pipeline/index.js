'use strict';

var pipeline = module.exports = require('export-files')(__dirname);
pipeline.extname = require('gulp-extname');
pipeline.ghPages = require('gulp-gh-pages');
