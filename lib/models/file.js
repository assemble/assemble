/**
 * Assemble <http://assemble.io>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 */

'use strict';

var model = require('../utils/model');
var Base = require('./base');

var properties = {
	src: '',      // path to the source file
	dest: '',     // path to the destination file if this will be written (some files are only read)
	content: '',  // contents of the file (any YAML front matter has been split out)
	raw: '',      // raw contents of the file, including both YFM and content
	metadata: {}, // any YAML front matter
	type: ''      // file type: DATA, PARTIAL, COMPONENT, PAGE, POST, etc...
};

module.exports = model.inherit(Base, properties);