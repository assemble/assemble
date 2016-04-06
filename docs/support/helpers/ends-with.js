'use strict';

module.exports = function(str, check, options) {
  if (arguments.length < 3) {
    var fp = this.context.view.path;
    console.log('{{ends-with}} helper is missing an argument. start by looking in: ' + fp);
    return '';
  }
  var re = new RegExp(check + '$');
  return (re.test(str)) ? options.fn(this) : options.inverse(this);
};
