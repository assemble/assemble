
/**
 * Lazily required module dependencies
 */

var lazy = module.exports = require('lazy-cache')(require);

lazy('engine-handlebars', 'engine');
lazy('delegate-properties', 'delegate');
lazy('extend-shallow', 'extend');
lazy('through2', 'through');
lazy('parser-front-matter', 'matter');
lazy('vinyl-fs', 'vfs');
lazy('vinyl', 'Vinyl');
lazy('to-vinyl');
lazy('dest');

var utils = lazy;
