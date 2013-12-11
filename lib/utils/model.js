/**
 * Assemble
 *
 * Assemble <http://assemble.io>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2013 Upstage.
 * Licensed under the MIT License (MIT).
 */

var model = module.exports = {};

model.inherit = function(Parent, prototype, properties) {

  // create a new Child class
  var Child = function() {
    Parent.call(this, Array.prototype.slice.call(this, arguments));
    this.init.apply(this, arguments);
  };

  // inherit from the Parent prototype
  // and add any additional properties
  Child.prototype = Object.create(
    Parent.prototype, 
    model.createPropertiesFromObject(prototype || {}));

  // if properties is defined add them as getters and setters
  if (properties && typeof properties === 'object') {
    model.createGetterSettingPropertiesFromObject(Child, properties);
  }

  // add a default init function to the Child class
  Child.prototype.init = function(options) {
    for (var key in options) {
      if(options.hasOwnProperty(key)) {
        this[key] = options[key];
      }
    }
  };

  return Child;
};

/**
 * Creates the value part of a property descriptor
 * @param  {[type]} value [description]
 * @return {[type]}       [description]
 */
model.createProperty = function(value) {
  return { 
    writable: true,
    configurable: true,
    value: value
  };
};

/**
 * Generate a property descriptor from an object.
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
model.createPropertiesFromObject = function(obj) {
  var rtn = {};
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      rtn[key] = model.createProperty(obj[key]);
    }
  }
  return rtn;
};

model.createGetterSetterProperty = function(Class, name, definition) {
  Object.defineProperty(Class.prototype, name, definition);
};

model.createGetterSettingPropertiesFromObject = function(Class, obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      model.createGetterSetterProperty(Class, key, obj[key]);
    }
  }
};