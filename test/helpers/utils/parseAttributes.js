/**
 * parseAttributes
 * @param  {[type]} hash [description]
 * @return {[type]}      [description]
 */

'use strict';

module.exports = function(hash) {
  return Object.keys(hash).map(function(key) {
    return "" + key + "=\"" + hash[key] + "\"";
  }).join(' ');
};
