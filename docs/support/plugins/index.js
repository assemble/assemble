'use strict';

var plugins = module.exports = require('export-files')(__dirname);
plugins.permalinks = require('assemble-permalinks');
plugins.collections = require('assemble-collections');
plugins.getDest = require('view-get-dest');
plugins.watch = require('base-watch');
