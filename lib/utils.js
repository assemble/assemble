/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT License (MIT).
 */
'use strict';

var path = require('path');
var grunt = require('grunt');
var _     = require('lodash');


var utils = module.exports = {};


utils.arrayify = function(arr) {
  return !Array.isArray(arr) ? [arr] : arr;
};


var toString = function (val) {
  if (val == null) {
    return '';
  } else {
    return val.toString();
  }
};
utils.toString = Object.prototype.toString;

utils.lowerCase = function (str) {
  str = toString(str);
  return str.toLowerCase();
};

utils.isUndefined = function (value) {
  return value === 'undefined' || utils.toString.call(value) === '[object Function]' || (value.hash != null);
};


// Windows? (from grunt.file)
var win32 = process.platform === 'win32';
utils.pathNormalize = function(urlString) {
  if (win32) {
  return urlString.replace(/\\/g, '/');
  } else {
    return urlString;
  }
};


utils.filenameRegex = /[^\\\/:*?"<>|\r\n]+$/i;

utils.extension = function(filename) {
  grunt.verbose.writeln('extension');
  grunt.verbose.writeln(filename);
  if(grunt.util.kindOf(filename) === 'array' && filename.length > 0) {
    filename = filename[0];
  }
  return _(filename.match(/[^.]*$/)).last();
};


/**
 * Check if the give file path ends with a slash.
 * @param  {String}  filepath
 * @return {Boolean}
 */
utils.endsWithSlash = function(filepath) {
  return /[\\\/]$/.test(filepath);
};
var endsWithSlash = utils.endsWithSlash;


/**
 * Check if the give file path ends with a dot.
 * @param  {String}  filepath
 * @return {Boolean}
 */

utils.endsWithDot = function(str) {
  return str[str.length -1] === '.';
};


/**
 * Check if the give file path ends with a dot.
 * @param  {String}  filepath
 * @return {Boolean}
 */

utils.endsWith = function(str, end) {
  return str[str.length -1] === end;
};


/**
 * Re-calculate the path from dest file to the given directory
 * defined in the assemble options, such as `assets`.
 * @param  {String} dest     Destination of the file.
 * @param  {String} toPath   Calculated "new" path.
 * @param  {String} origPath Stored original path to check against.
 * @return {String}
 */

utils.calculatePath = function(destdir, toPath, origPath) {
  var relativePath = path.relative(path.resolve(destdir), path.resolve(toPath));
  toPath = utils.pathNormalize(relativePath);
  // if the relative path is blank, then it's the same folder
  // so update to be '' or './'
  if(!toPath || toPath.length === 0) {
    // if the original path had a trailing slash
    if(endsWithSlash(origPath)) {
      // return './'
      toPath = './';
    } else {
      // otherwise return ''
      toPath = '.';
    }
  }
  // if the original path had a trailing slash and the calculated
  // path does not, add a trailing slash
  if(endsWithSlash(origPath) && !endsWithSlash(toPath)) {
    toPath += '/';
    // Otherwise, if the original path did not have a trailing slash
    // and the calculated path does, remove the trailing slash
  } else if (!endsWithSlash(origPath) && endsWithSlash(toPath)) {
    toPath = toPath.substring(0, toPath.length - 2);
  }
  return toPath;
};

/**
 * Returns 'directory' or 'file' based on the given path.
 * @param  {String} file path
 */

 utils.detectDestType = function(dest) {
  if(utils.endsWith(dest, '/') || grunt.file.isDir(dest)) {
    return 'directory';
  } else if (grunt.file.isFile(dest)) {
    if (grunt.file.exists(dest)) {
      return 'file';
    } else {
      throw new Error('Invalid file path.');
    }
  }
};



utils.findBasePath = function(srcFiles, basePath) {
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
 * Read in the given data file based on the file extension.
 * @param  {String} ext The file extension to check.
 * @return {Object}     JSON data object.
 */
utils.dataFileReaderFactory = function(ext) {
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
