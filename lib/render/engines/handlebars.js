/**
 * Assemble
 *
 * Assemble <http://assemble.io>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2013 Upstage.
 * Licensed under the MIT License (MIT).
 */


// events that handlebars might emit
var events = {
	handlebarsBeforeParse: 'handlebars:before:parse',
	handlebarsAfterParse: 'handlebars:after:parse',
	handlebarsBeforeCompile: 'handlebars:before:compile',
	handlebarsAfterCompile: 'handlebars:after:compile',
	handlebarsBeforeRender: 'handlebars:before:render',
	handlebarsAfterRender: 'handlebars:after:render'
};

var handlebars = module.exports = function() {};
