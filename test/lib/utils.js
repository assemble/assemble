
var _ = require('lodash');
var hu = require('haraldutil');

var utils = module.exports = {};

utils.normalizeStack = function (top, fn) {
  if (_.isFunction(top)) {
    fn = top;
    top = 10;
  }
  try { fn(); }
  catch (ex) {
    var trace = hu.parseTrace(ex);
    if (trace) {
      var frameLeadin = '\n\u0020\u0020\u0020\u0020at\u0020';
      var mapText = function (frame) {
        return frame.text;
      };
      ex.stack = [''].concat(_.map(trace.frames.slice(0, top), mapText)).join(frameLeadin);
    }
    throw ex;
  }
};
