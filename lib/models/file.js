/**
 * Assemble
 *
 * Assemble <http://assemble.io>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2014 Upstage.
 * Licensed under the MIT License (MIT).
 */

var utils = require('../utils');

var properties = {
	src: '', // path to the source file
	dest: '', // path to the destination file if this will be written (some files are only read)
	content: '', // contents of the file (any yaml front matter has been split out)
	raw: '', // raw contents of the file
	metadata: {}, // any yaml front matter
	type: '' // file type: DATA, PARTIAL, COMPONENT, PAGE, POST, etc...
};

var File = module.exports = utils.model.inherit(require('./base'), properties);