/**
 * Assemble middleware example
 */

module.exports = function(assemble) {
  'use strict';

  var middleware = function (params, next) {
    console.log('JavaScript Example Middleware', params.event);

    // do stuff

    next();
  };


  // Can be a single `event`, or an `events` array
  middleware.event = 'page:after:render';
  return {
    'assemble-middleware-example': middleware
  };
};