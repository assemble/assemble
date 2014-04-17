
/**
 * Assemble
 *
 * Assemble <http://assemble.io>
 * Created and maintained by Jon Schlinkert and Brian Woodward
 *
 * Copyright (c) 2014 Assemble.
 * Licensed under the MIT License (MIT).
 */

// node_modules
var file = require('fs-utils');
var async = require('async');
var _ = require('lodash');


// local modules
var utils = require('../../utils').utils;


/**
 * Load templates and register them as helpers using
 * conventions from components in Ember.
 *
 * Best practise is to store components in a
 * templates/components folder.
 *
 * Name components with a hyphen (blog-post) so the
 * component can be used inside a template like
 * {{blogPost}}
 *
 * Frontmatter will be loaded and stored in the metadata
 * of the component and merged into the context inside the helper
 * so it'll be available inside the component and override
 * any values on the context (TODO: should this be `component.property`
 * instead of overriding `root.property`?)
 *
 * If an associated javascript file is found next to the component,
 * that logic will be loaded in (figure out how to make this work with Ember)
 * eg: templates/components/blog-post.js
 *
 * If {{yeild}} is found inside the component content, the component
 * will be turned into a block helper allowing the caller of the component
 * to inject custom html.
 */

var componentHandler = module.exports = {};

var addComponent = function (components, component) {
  utils.expandComponent(component);
  components.push(component);
};

componentHandler.normalizeComponents = function (source, assemble) {

  var components = [];
  source  = file.arrayify(source);

  for (var i = 0; i < source.length; i++) {
    if (typeof source[i] === 'string') {
      var files = file.expand(source[i]);
      for (var f = 0; f < files.length; f++) {
        addComponent(components, assemble.models.Component.readFile(files[f]));
      }
    }

    if (typeof source[i] === 'object' && source[i] instanceof assemble.models.Component) {
      addComponent(components, source[i]);
    }

    if (typeof source[i] === 'object' && !(source[i] instanceof assemble.models.Component)) {
      var component = source[i];
      var options = {
        name: component.name || 'component-' + i,
        src: component.src || 'component-' + i,
        raw: component.raw || component.content || ''
      };
      addComponent(components, new assemble.models.Component(options));
    }
  }

  return components;

};

componentHandler.loadComponents = function (source, assemble, done) {

  assemble.componentTree = assemble.componentTree || {};
  var nodeIndex = 0;

  var components = componentHandler.normalizeComponents(source, assemble);

  async.eachSeries(components, function (component, next) {

    component.name = componentHandler.resolveName(component.name || component.src);

    component.helper = function (ctx, options) {
      options = options || ctx || {};
      var context = _.merge({}, assemble.context(), ctx, options.hash || {});
      var tmpl = assemble.Handlebars.compile(component.content, { data: true});
      var content = tmpl(context, { data: context });

      // add the component information to the component tree
      assemble.componentTree[nodeIndex] = _.cloneDeep(component);
      assemble.componentTree[nodeIndex].context = context;
      assemble.componentTree[nodeIndex].instanceContext = ctx;
      nodeIndex++;

      return new assemble.Handlebars.SafeString(content);
    };

    next();
  },
  function (err) {
    if (err) {
      return done(err);
    }
    var helpers = {};
    _.map(components, function (component) {
      helpers[component.name] = component.helper;
    });

    assemble.engine.registerHelpers(helpers, function (err) {
      if (err) {
        return done(err);
      }
      return done(null, components);
    });
  });

};

componentHandler.resolveName = function (name) {
  if (name.indexOf('component') === 0 && name.indexOf('/') !== -1) {
    name = name.replace('component/', '').replace('components/', '');
  }
  return _.str.camelize(name);
};
