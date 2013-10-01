/*
 * Assemble Utils
 * https://github.com/assemble/
 *
 * Copyright (c) 2013 Upstage
 * Licensed under the MIT license.
 */


// Node.js
var path = require('path');

// node_modules
var grunt = require('grunt');
var _str  = grunt.util._.str;
var _     = require('lodash'); // newer methods

// The module to be exported.
var Utils = module.exports = {};



// Windows? (from grunt.file)
var win32 = process.platform === 'win32';
Utils.pathNormalize = function(urlString) {
  if (win32) {
  return urlString.replace(/\\/g, '/');
  } else {
    return urlString;
  }
};


Utils.filenameRegex = /[^\\\/:*?"<>|\r\n]+$/i;

Utils.extension = function(filename) {
  grunt.verbose.writeln('extension');
  grunt.verbose.writeln(filename);
  if(grunt.util.kindOf(filename) === 'array' && filename.length > 0) {
    filename = filename[0];
  }
  return _(filename.match(/[^.]*$/)).last();
};




/**
 * Is the given path a directory or a file?
 * @param  {String} filepath
 * @return {String}
 */
Utils.detectDestType = function(filepath) {
  // if(_str.endsWith(path.normalize(filepath), path.sep)) {
  //   return 'directory';
  // } else {
  //   return 'file';
  // }
  if(grunt.file.isDir(filepath)) {
    return 'directory';
  } else if (grunt.file.isFile(filepath)) {
    if (grunt.file.exists(filepath)) {
      return 'file';
    } else {
      throw new Error('Invalid file path.');
    }
  }
};


Utils.findBasePath = function(srcFiles, basePath) {
  if (basePath === false) {return '';}
  if (grunt.util.kindOf(basePath) === 'string' && basePath.length >= 1) {
    return _(path.normalize(basePath)).trim(path.sep);
  }
  var foundPath, basePaths = [], dirName;
  srcFiles.forEach(function(srcFile) {
    srcFile = path.normalize(srcFile);
    dirName = path.dirname(srcFile);
    basePaths.push(dirName.split(path.sep));
  });
  basePaths = _.intersection.apply([], basePaths);
  foundPath = path.join.apply(path, basePaths);
  if (foundPath === '.') {foundPath = '';}
  return foundPath;
};


/**
 * Check if the give file path ends with a slash.
 * @param  {String}  filePath
 * @return {Boolean}
 */
Utils.hasTrailingSlash = function(filePath) {
  return _str.endsWith(path.normalize(filePath), path.sep);
};


/**
 * Read in the given data file based on the file extension.
 * @param  {String} ext The file extension to check.
 * @return {Object}     JSON data object.
 */
Utils.dataFileReaderFactory = function(ext) {
  var reader = grunt.file.readJSON;
  switch(ext) {
    case '.json':
      reader = grunt.file.readJSON;
      break;
    case '.yml':
    case '.yaml':
      reader = grunt.file.readYAML;
      break;
  }
  return reader;
};
