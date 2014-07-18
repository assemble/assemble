'use strict';

/**
 * Module dependencies.
 */

var debug = require('debug')('express:router:route');
var _ = require('lodash');


/**
 * Expose `Route`.
 */

module.exports = Route;


/**
 * Initialize `Route` with the given `path`,
 *
 * @param {String} path
 * @api private
 */

function Route(path) {
  debug('new %s', path);
  this.path = path;
  this.stack = [];
}


/**
 * dispatch req, res into this route
 *
 * @api private
 */

Route.prototype.dispatch = function(req, res, done){
  var stack = this.stack;
  if (stack.length === 0) {
    return done();
  }

  req.route = this;

  var idx = 0;
  (function nextLayer(err) {
    if (err && err === 'route') {
      return done();
    }

    var layer = stack[idx++];
    if (!layer) {
      return done(err);
    }

    var arity = layer.handle.length;
    if (err) {
      if (arity < 4) {
        return nextLayer(err);
      }

      try {
        layer.handle(err, req, res, nextLayer);
      } catch (err) {
        nextLayer(err);
      }
      return;
    }

    if (arity > 3) {
      return nextLayer();
    }

    try {
      layer.handle(req, res, nextLayer);
    } catch (err) {
      nextLayer(err);
    }
  })();
};


/**
 * Add a handler for all HTTP verbs to this route.
 *
 * Behaves just like middleware and can respond or call `next`
 * to continue processing.
 *
 * You can use multiple `.all` call to add multiple handlers.
 *
 *   function check_something(req, res, next){
 *     next();
 *   };
 *
 *   function validate_user(req, res, next){
 *     next();
 *   };
 *
 *   route
 *   .all(validate_user)
 *   .all(check_something)
 *   .get(function(req, res, next){
 *     res.send('hello world');
 *   });
 *
 * @param {function} handler
 * @return {Route} for chaining
 * @api public
 */

Route.prototype.all = function(){
  var self = this;

  var callbacks = _.flatten([].slice.call(arguments));
  callbacks.forEach(function(fn) {
    if (typeof fn !== 'function') {
      var type = {}.toString.call(fn);
      var msg = 'Route.all() requires callback functions but got a ' + type;
      throw new Error(msg);
    }
    self.stack.push({ handle: fn });
  });
  return self;
};
