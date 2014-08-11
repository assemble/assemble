'use strict';

/**
 * Module dependencies.
 */

var Cache = require('config-cache');
var getNamespace = require('continuation-local-storage').getNamespace;
var createNamespace = require('continuation-local-storage').createNamespace;

var sessionName = 'assemble session';
var session = getNamespace(sessionName) || createNamespace(sessionName);


/**
 * Determine if the session is actual active.
 * 
 * @return {Boolean} If session is active
 * @api private
 */

var isActive = function () {
  try {
    var key = '___session is active___';
    return session.get(key) || session.set(key, true);
  } catch (err) {
    return false;
  }
};

// backup cache when session isn't active
var cache = new Cache();


module.exports = {


  /**
   * Create a context to run in.
   * 
   * @param {Function} `fn` function to run in the session context
   * @api private
   */
  
  run: session.run.bind(session),


  /**
   * Get a value from the current session by the given key.
   * 
   * @param  {String} `key` Key used to retrieve the value
   * @return {mixed}  Value of the key or undefined
   */
  
  get: function (key) {
    if (isActive()) {
      return session.get(key);
    }
    return cache.get(key);
  },


  /**
   * Set a value on the current session by the given key.
   * 
   * @param {String} `key`   Key used to set the value
   * @param  {mixed} `value` Value to set
   * @return {mixed} Value that was just set
   */
  
  set: function (key, value) {
    if (isActive()) {
      return session.set(key, value);
    }
    return cache.set(key, value);
  }
};