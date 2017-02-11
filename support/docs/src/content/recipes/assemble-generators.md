---
title: Assemble generators
draft: true
---

**HEADS UP!** This may currently work, but it's not officially supported yet! Please don't create issues related to running generators until it's officially added to the API and fully documented. Thanks!

When packages with the naming convention `assemble-generator-*` are locally or globally installed in `node_modules`, assemble's CLI will automatically load them and make each generator available by command line using its [namespace](#generator-namespaces).

## Generator namespaces

A generator's "namespace" is created by stripping the `assemble-generator-` substring from the name of the generator.

For example, the namespace for `assemble-generator-foo` is `foo`.


## Discovering generators

You can find generators to install on npm using the [assemblegenerator](https://www.npmjs.com/browse/keyword/assemblegenerator) keyword.


## Authoring generators

We have a confession to make. An assemble generator is just an `assemblefile.js` wrapped in a function, but without having to `require()` in assemble... how great is that!

**Example**

```js
module.exports = function(app) {
  app.task('default', function(cb) {
    // do stuff
    cb();
  });
};
```

## Running installed generators

You can run an installed generator from the command line by passing it's namespace after the `assemble` command.

For example, when the following command is given:

```sh
$ assemble foo
```

Assemble's CLI will do the following:

TODO
