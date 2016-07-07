---
title: Core application
category: api
---
# API

## Core API

Assemble's core API is powered by [base][], [cache-base][].

### .set

Assign `value` to `key`. Also emits `set` with the key and value.

**Params**

* `key` **{String}**
* `value` **{any}**
* `returns` **{Object}**: Returns the instance for chaining.

**Events**

* `emits`: `set` with `key` and `value` as arguments.

**Example**

```js
app.on('set', function(key, val) {
  // do something when `set` is emitted
});

app.set(key, value);

// also takes an object or array
app.set({name: 'Halle'});
app.set([{foo: 'bar'}, {baz: 'quux'}]);
console.log(app);
//=> {name: 'Halle', foo: 'bar', baz: 'quux'}
```

### .get

Return the value of `key`. Dot notation may be used to get [nested property values][get-value].

**Params**

* `key` **{String}**: The name of the property to get. Dot-notation may be used.
* `returns` **{any}**: Returns the value of `key`

**Events**

* `emits`: `get` with `key` and `value` as arguments.

**Example**

```js
app.set('a.b.c', 'd');
app.get('a.b');
//=> {c: 'd'}

app.get(['a', 'b']);
//=> {c: 'd'}
```

### .has

Return true if app has a stored value for `key`, false only if value is `undefined`.

**Params**

* `key` **{String}**
* `returns` **{Boolean}**

**Events**

* `emits`: `has` with `key` and true or false as arguments.

**Example**

```js
app.set('foo', 'bar');
app.has('foo');
//=> true
```

### .del

Delete one or more properties from the instance.

**Params**

* `key` **{String|Array}**: Property name or array of property names.
* `returns` **{Object}**: Returns the instance for chaining.

**Events**

* `emits`: `del` with the `key` as the only argument.

**Example**

```js
app.del(); // delete all
// or
app.del('foo');
// or
app.del(['foo', 'bar']);
```

### .clear

Reset the entire cache to an empty object.

**Example**

```js
app.clear();
```

### .visit

Visit `method` over the properties in the given object, or map
visit over the object-elements in an array.

**Params**

* `method` **{String}**: The name of the `base` method to call.
* `val` **{Object|Array}**: The object or array to iterate over.
* `returns` **{Object}**: Returns the instance for chaining.


### .is

Set the given `name` on `app._name` and `app.is*` properties. Used for doing lookups in plugins.

**Params**

* `name` **{String}**
* `returns` **{Boolean}**

**Example**

```js
app.is('foo');
console.log(app._name);
//=> 'foo'
console.log(app.isFoo);
//=> true
app.is('bar');
console.log(app.isFoo);
//=> true
console.log(app.isBar);
//=> true
console.log(app._name);
//=> 'bar'
```

### .isRegistered

Returns true if a plugin has already been registered on an instance.

Plugin implementors are encouraged to use this first thing in a plugin
to prevent the plugin from being called more than once on the same
instance.

**Params**

* `name` **{String}**: The plugin name.
* `register` **{Boolean}**: If the plugin if not already registered, to record it as being registered pass `true` as the second argument.
* `returns` **{Boolean}**: Returns true if a plugin is already registered.

**Events**

* `emits`: `plugin` Emits the name of the plugin.

**Example**

```js
var base = new Base();
base.use(function(app) {
  if (app.isRegistered('myPlugin')) return;
  // do stuff to `app`
});

// to also record the plugin as being registered
base.use(function(app) {
  if (app.isRegistered('myPlugin', true)) return;
  // do stuff to `app`
});
```

### .assertPlugin

Throws an error when plugin `name` is not registered.

**Params**

* `name` **{String}**: The plugin name.

**Example**

```js
var base = new Base();
base.use(function(app) {
  app.assertPlugin('base-foo');
  app.assertPlugin('base-bar');
  app.assertPlugin('base-baz');
});
```

### .use

Define a plugin function to be called immediately upon init. Plugins are chainable and the only parameter exposed to the plugin is the application instance.

**Params**

* `fn` **{Function}**: plugin function to call
* `returns` **{Object}**: Returns the item instance for chaining.

**Events**

* `emits`: `use` with no arguments.

**Example**

```js
var app = new Base()
  .use(foo)
  .use(bar)
  .use(baz)
```

### .lazy

Lazily invoke a registered plugin. **Note** that this method can only be used with:

1. plugins that _add a single method or property_ to `app`
2. plugins that do not (themselves) add a getter/setter property (they're already lazy)
3. plugins that do not return a function

**Params**

* `prop` **{String}**: The name of the property or method added by the plugin.
* `fn` **{Function}**: The plugin function
* `options` **{Object}**: Options to use when the plugin is invoked.
* `returns` **{Object}**: Returns the instance for chaining

**Example**

```js
app.lazy('store', require('base-store'));
```

### .define

Define a non-enumerable property on the instance. Dot-notation is **not supported** with `define`.

**Params**

* `key` **{String}**: The name of the property to define.
* `value` **{any}**
* `returns` **{Object}**: Returns the instance for chaining.

**Events**

* `emits`: `define` with `key` and `value` as arguments.

**Example**

```js
// arbitrary `render` function using lodash `template`
define('render', function(str, locals) {
  return _.template(str)(locals);
});
```

### .mixin

Mix property `key` onto the Base prototype. If base-methods
is inherited using `Base.extend` this method will be overridden
by a new `mixin` method that will only add properties to the
prototype of the inheriting application.

**Params**

* `key` **{String}**
* `val` **{Object|Array}**
* `returns` **{Object}**: Returns the instance for chaining.

### .use

Static method for adding global plugin functions that will be added to an instance when created.

**Params**

* `fn` **{Function}**: Plugin function to use on each instance.

**Example**

```js
Base.use(function(app) {
  app.foo = 'bar';
});
var app = new Base();
console.log(app.foo);
//=> 'bar'
```

### .extend

Static method for inheriting both the prototype and
static methods of the `Base` class. See [class-utils](https://github.com/jonschlinkert/class-utils)
for more details.

### App.mixin

Static method for adding mixins to the prototype. When a function is returned from the mixin plugin, it will be added to an array so it can be used on inheriting classes via `Base.mixins(Child)`.

**Params**

* `fn` **{Function}**: Function to call

**Example**

```js
Base.mixin(function fn(proto) {
  proto.foo = function(msg) {
    return 'foo ' + msg;
  };
  return fn;
});
```

### App.mixins

Static method for running currently saved global mixin functions against a child constructor.

**Params**

* `Child` **{Function}**: Constructor function of a child class

**Example**

```js
Base.extend(Child);
Base.mixins(Child);
```

### .inherit

Similar to `util.inherit`, but copies all static properties,
prototype properties, and descriptors from `Provider` to `Receiver`.
[class-utils](https://github.com/jonschlinkert/class-utils)for more details.

***

## Options API

Assemble's Options API is powered by [base-option][] and [option-cache][].

### .option

Set or get an option.

**Params**

* `key` **{String}**: The option name.
* `value` **{any}**: The value to set.
* `returns` **{any}**: Returns a `value` when only `key` is defined.

**Example**

```js
app.option('a', true);
app.option('a');
//=> true
```

### .hasOption

Return true if `options.hasOwnProperty(key)`

**Params**

* `prop` **{String}**
* `returns` **{Boolean}**: True if `prop` exists.

**Example**

```js
app.hasOption('a');
//=> false
app.option('a', 'b');
app.hasOption('a');
//=> true
```

### .enable

Enable `key`.

**Params**

* `key` **{String}**
* `returns` **{Object}** `Options`: to enable chaining

**Example**

```js
app.enable('a');
```

### .disable

Disable `key`.

**Params**

* `key` **{String}**: The option to disable.
* `returns` **{Object}** `Options`: to enable chaining

**Example**

```js
app.disable('a');
```

### .enabled

Check if `prop` is enabled (truthy).

**Params**

* `prop` **{String}**
* `returns` **{Boolean}**

**Example**

```js
app.enabled('a');
//=> false

app.enable('a');
app.enabled('a');
//=> true
```

### .disabled

Check if `prop` is disabled (falsey).

**Params**

* `prop` **{String}**
* `returns` **{Boolean}**: Returns true if `prop` is disabled.

**Example**

```js
app.disabled('a');
//=> true

app.enable('a');
app.disabled('a');
//=> false
```

### .isTrue

Returns true if the value of `prop` is strictly `true`.

**Params**

* `prop` **{String}**
* `returns` **{Boolean}**: Uses strict equality for comparison.

**Example**

```js
app.option('a', 'b');
app.isTrue('a');
//=> false

app.option('c', true);
app.isTrue('c');
//=> true

app.option({a: {b: {c: true}}});
app.isTrue('a.b.c');
//=> true
```

### .isFalse

Returns true if the value of `key` is strictly `false`.

**Params**

* `prop` **{String}**
* `returns` **{Boolean}**: Uses strict equality for comparison.

**Example**

```js
app.option('a', null);
app.isFalse('a');
//=> false

app.option('c', false);
app.isFalse('c');
//=> true

app.option({a: {b: {c: false}}});
app.isFalse('a.b.c');
//=> true
```

### .isBoolean

Return true if the value of key is either `true` or `false`.

**Params**

* `key` **{String}**
* `returns` **{Boolean}**: True if `true` or `false`.

**Example**

```js
app.option('a', 'b');
app.isBoolean('a');
//=> false

app.option('c', true);
app.isBoolean('c');
//=> true
```

### .option.set

Set option `key` on `app.options` with the given `value`

**Params**

* `key` **{String}**: Option key, dot-notation may be used.
* `value` **{any}**

**Example**

```js
app.option.set('a', 'b');
console.log(app.option.get('a'));
//=> 'b'
```

### .option.get

Get option `key` from `app.options`

**Params**

* `key` **{String}**: Option key, dot-notation may be used.
* `returns` **{any}**

**Example**

```js
app.option({a: 'b'});
console.log(app.option.get('a'));
//=> 'b'
```

### .option.create

Returns a shallow clone of `app.options` with all of the options methods, as well as a `.merge` method for merging options onto the cloned object.

**Params**

* `options` **{Options}**: Object to merge onto the returned options object.
* `returns` **{Object}**

**Example**

```js
var opts = app.option.create();
opts.merge({foo: 'bar'});
```

***

## Plugin API

Assemble's Plugin API is powered by [base-plugins][].

### .use

Define a plugin function to be called immediately upon init. The only parameter exposed to the plugin is the application instance.

Also, if a plugin returns a function, the function will be pushed
onto the `fns` array, allowing the plugin to be called at a
later point, elsewhere in the application.

**Params**

* `fn` **{Function}**: plugin function to call
* `returns` **{Object}**: Returns the item instance for chaining.

**Example**

```js
// define a plugin
function foo(app) {
  // do stuff
}

// register plugins
var app = new Base()
  .use(foo)
  .use(bar)
  .use(baz)
```

### .run

Run all plugins

**Params**

* `value` **{Object}**: Object to be modified by plugins.
* `returns` **{Object}**: Returns the item instance for chaining.

**Example**

```js
var config = {};
app.run(config);
```

***

## Task API

Assemble's Task API is powered by [base-task][] and [composer][].

### .task

Register a new task with it's options and dependencies. To return the task object of an already registered task, pass the name of the task without any additional parameters.

Dependencies may also be specified as a glob pattern. Be aware that
the order cannot be guarenteed when using a glob pattern.

**Params**

* `name` **{String}**: Name of the task to register
* `options` **{Object}**: Options to set dependencies or control flow.
* `options.deps` **{Object}**: array of dependencies
* `options.flow` **{Object}**: How this task will be executed with it's dependencies (`series`, `parallel`, `settleSeries`, `settleParallel`)
* `deps` **{String|Array|Function}**: Additional dependencies for this task.
* `fn` **{Function}**: Final function is the task to register.
* `returns` **{Object}**: Return the instance for chaining

**Example**

```js
// register task "site" with composer
app.task('site', ['styles'], function() {
  return app.src('templates/pages/*.hbs')
    .pipe(app.dest('_gh_pages'));
});

// get the "site" task object
var task = app.task('site');
```

### .build

Build a task or array of tasks.

**Params**

* `tasks` **{String|Array|Function}**: List of tasks by name, function, or array of names/functions. (Defaults to `[default]`).
* `cb` **{Function}**: Callback function to be called when all tasks are finished building.

**Example**

```js
app.build('default', function(err, results) {
  if (err) return console.error(err);
  console.log(results);
});
```

### .series

Compose task or list of tasks into a single function that runs the tasks in series.

**Params**

* `tasks` **{String|Array|Function}**: List of tasks by name, function, or array of names/functions.
* `returns` **{Function}**: Composed function that may take a callback function.

**Example**

```js
app.task('foo', function(done) {
  console.log('this is foo');
  done();
});

var fn = app.series('foo', function bar(done) {
  console.log('this is bar');
  done();
});

fn(function(err) {
  if (err) return console.error(err);
  console.log('done');
});
//=> this is foo
//=> this is bar
//=> done
```

### .parallel

Compose task or list of tasks into a single function that runs the tasks in parallel.

**Params**

* `tasks` **{String|Array|Function}**: List of tasks by name, function, or array of names/functions.
* `returns` **{Function}**: Composed function that may take a callback function.

**Example**

```js
app.task('foo', function(done) {
  setTimeout(function() {
    console.log('this is foo');
    done();
  }, 500);
});

var fn = app.parallel('foo', function bar(done) {
  console.log('this is bar');
  done();
});

fn(function(err) {
  if (err) return console.error(err);
  console.log('done');
});
//=> this is bar
//=> this is foo
//=> done
```

## Events

[composer](https://github.com/jonschlinkert/composer) is an event emitter that may emit the following events:

### starting

This event is emitted when a `build` is starting.

The event emits 2 arguments, the current instance of [composer](https://github.com/jonschlinkert/composer) as the `app` and an object containing the build runtime information.

```js
app.on('starting', function(app, build) {});
```

* `build` exposes a `.date` object that has a `.start` property containing the start time as a `Date` object.
* `build` exposes a `.hr` object that has a `.start` property containing the start time as an `hrtime` array.

### finished

This event is emitted when a `build` has finished.

The event emits 2 arguments, the current instance of [composer](https://github.com/jonschlinkert/composer) as the `app` and an object containing the build runtime information.

```js
app.on('finished', function(app, build) {});
```

* `build` exposes a `.date` object that has `.start` and `.end` properties containing start and end times of the build as `Date` objects.
* `build` exposes a `.hr` object that has `.start`, `.end`, `.duration`, and `.diff` properties containing timing information calculated using `process.hrtime`

### error

This event is emitted when an error occurrs during a `build`.
The event emits 1 argument as an `Error` object containing additional information about the build and the task running when the error occurred.

```js
app.on('error', function(err) {});
```

Additional properties:

* `app`: current composer instance running the build
* `build`: current build runtime information
* `task`: current task instance running when the error occurred
* `run`: current task runtime information

### task:starting

This event is emitted when a task is starting.
The event emits 2 arguments, the current instance of the task object and an object containing the task runtime information.

```js
app.on('task:starting', function(task, run) {});
```

The `run` parameter exposes:

* `.date` **{Object}**: has a `.start` property containing the start time as a `Date` object.
* `.hr` **{Object}**: has a `.start` property containing the start time as an `hrtime` array.

### task:finished

This event is emitted when a task has finished.

The event emits 2 arguments, the current instance of the task object and an object containing the task runtime information.

```js
app.on('task:finished', function(task, run) {});
```

The `run` parameter exposes:

* `.date` **{Object}**: has a `.date` object that has `.start` and `.end` properties containing start and end times of the task as `Date` objects.
* `run` **{Object}**: has an `.hr` object that has `.start`, `.end`, `.duration`, and `.diff` properties containing timing information calculated using `process.hrtime`

### task:error

This event is emitted when an error occurrs while running a task.
The event emits 1 argument as an `Error` object containing additional information about the task running when the error occurred.

```js
app.on('task:error', function(err) {});
```

**Additional properties**

* `task`: current task instance running when the error occurred
* `run`: current task runtime information

***

## Templates API

### Common methods

This section describes methods that are common to all classes exposed through the templates API.

#### .option

Set or get an option value.

**Params**

* `key` **{String|Object}**: Pass a key-value pair or an object to set.
* `val` **{any}**: Any value when a key-value pair is passed. This can also be options if a glob pattern is passed as the first value.
* `returns` **{Object}**: Returns the instance for chaining.

**Example**

```js
app.option('a', 'b');
app.option({c: 'd'});
console.log(app.options);
//=> {a: 'b', c: 'd'}
```

#### .use

Run a plugin on the given instance. Plugins are invoked immediately upon instantiating in the order in which they were defined.

**Example**

The simplest plugin looks something like the following:

```js
app.use(function(inst) {
  // do something to `inst`
});
```

Note that `inst` is the instance of the class you're instantiating. So if you create an instance of `Collection`, inst is the collection instance.

**Params**

* `fn` **{Function}**: Plugin function. If the plugin returns a function it will be passed to the `use` method of each item created on the instance.
* `returns` **{Object}**: Returns the instance for chaining.

**Usage**

```js
collection.use(function(items) {
  // `items` is the instance, as is `this`

  // optionally return a function to be passed to
  // the `.use` method of each item created on the
  // instance
  return function(item) {
    // do stuff to each `item`
  };
});
```

### .list

Create a new list. See the [list docs](docs/lists.md) for more information about lists.

**Params**

* `opts` **{Object}**: List options
* `returns` **{Object}**: Returns the `list` instance for chaining.

**Example**

```js
var list = app.list();
list.addItem('abc', {content: '...'});

// or, create list from a collection
app.create('pages');
var list = app.list(app.pages);
```

### .collection

Create a new collection. Collections are decorated with special methods for getting and setting items from the collection. Note that, unlike the [create](#create) method, collections created with `.collection()` are not cached.

See the [collection docs](docs/collections.md) for more
information about collections.

**Params**

* `opts` **{Object}**: Collection options
* `returns` **{Object}**: Returns the `collection` instance for chaining.

### .create

Create a new view collection to be stored on the `app.views` object. See
the [create docs](docs/collections.md#create) for more details.

**Params**

* `name` **{String}**: The name of the collection to create. Plural or singular form may be used, as the inflections are automatically resolved when the collection is created.
* `opts` **{Object}**: Collection options
* `returns` **{Object}**: Returns the `collection` instance for chaining.

### .setup

Expose static `setup` method for providing access to an instance before any other use code is run.

**Params**

* `app` **{Object}**: Application instance
* `name` **{String}**: Optionally pass the constructor name to use.
* `returns` **{undefined}**

**Example**

```js
function App(options) {
  Templates.call(this, options);
  Templates.setup(this);
}
Templates.extend(App);
```

***

### .engine

Register a view engine callback `fn` as `ext`.

**Params**

* `exts` **{String|Array}**: String or array of file extensions.
* `fn` **{Function|Object}**: or `settings`
* `settings` **{Object}**: Optionally pass engine options as the last argument.

**Example**

```js
app.engine('hbs', require('engine-handlebars'));

// using consolidate.js
var engine = require('consolidate');
app.engine('jade', engine.jade);
app.engine('swig', engine.swig);

// get a registered engine
var swig = app.engine('swig');
```

***

### .helper

Register a template helper.

**Params**

* `name` **{String}**: Helper name
* `fn` **{Function}**: Helper function.

**Example**

```js
app.helper('upper', function(str) {
  return str.toUpperCase();
});
```

### .helpers

Register multiple template helpers.

**Params**

* `helpers` **{Object|Array}**: Object, array of objects, or glob patterns.

**Example**

```js
app.helpers({
  foo: function() {},
  bar: function() {},
  baz: function() {}
});
```

### .getHelper

Get a previously registered helper.

**Params**

* `name` **{String}**: Helper name
* `returns` **{Function}**: Returns the registered helper function.

**Example**

```js
var fn = app.getHelper('foo');
```

### .getAsyncHelper

Get a previously registered async helper.

**Params**

* `name` **{String}**: Helper name
* `returns` **{Function}**: Returns the registered helper function.

**Example**

```js
var fn = app.getAsyncHelper('foo');
```

### .hasHelper

Return true if sync helper `name` is registered.

**Params**

* `name` **{String}**: sync helper name
* `returns` **{Boolean}**: Returns true if the sync helper is registered

**Example**

```js
if (app.hasHelper('foo')) {
  // do stuff
}
```

### .hasAsyncHelper

Return true if async helper `name` is registered.

**Params**

* `name` **{String}**: Async helper name
* `returns` **{Boolean}**: Returns true if the async helper is registered

**Example**

```js
if (app.hasAsyncHelper('foo')) {
  // do stuff
}
```

### .asyncHelper

Register an async helper.

**Params**

* `name` **{String}**: Helper name.
* `fn` **{Function}**: Helper function

**Example**

```js
app.asyncHelper('upper', function(str, next) {
  next(null, str.toUpperCase());
});
```

### .asyncHelpers

Register multiple async template helpers.

**Params**

* `helpers` **{Object|Array}**: Object, array of objects, or glob patterns.

**Example**

```js
app.asyncHelpers({
  foo: function() {},
  bar: function() {},
  baz: function() {}
});
```

### .helperGroup

Register a namespaced helper group.

**Params**

* `helpers` **{Object|Array}**: Object, array of objects, or glob patterns.

**Example**

```js
// markdown-utils
app.helperGroup('mdu', {
  foo: function() {},
  bar: function() {},
});

// Usage:
// <%%= mdu.foo() %>
// <%%= mdu.bar() %>
```

### Built-in helpers

***

### View

API for the `View` class.

### View

Create an instance of `View`. Optionally pass a default object to use.

**Params**

* `view` **{Object}**

**Example**

```js
var view = new View({
  path: 'foo.html',
  content: '...'
});
```

### .context

Creates a context object from front-matter data, `view.locals` and the given `locals` object.

**Params**

* `locals` **{Object}**: Optionally pass locals to the engine.
* `returns` **{Object}**: Returns the context object.

**Example**

```js
var ctx = page.context({foo: 'bar'});
```

### .compile

Synchronously compile a view.

**Params**

* `locals` **{Object}**: Optionally pass locals to the engine.
* `returns` **{Object}** `View`: instance, for chaining.

**Example**

```js
var view = page.compile();
view.fn({title: 'A'});
view.fn({title: 'B'});
view.fn({title: 'C'});
```

### .render

Asynchronously render a view.

**Params**

* `locals` **{Object}**: Optionally pass locals to the engine.
* `returns` **{Object}** `View`: instance, for chaining.

**Example**

```js
view.render({title: 'Home'}, function(err, res) {
  //=> view object with rendered `content`
});
```

### .isType

Return true if the view is the given view `type`. Since types are assigned by collections, views that are "collection-less" will not have a type, and thus will always return `false` (as expected).

**Params**

* `type` **{String}**: (`renderable`, `partial`, `layout`)

**Example**

```js
view.isType('partial');
```

### .data

Set, get and load data to be passed to templates as context at render-time.

**Params**

* `key` **{String|Object}**: Pass a key-value pair or an object to set.
* `val` **{any}**: Any value when a key-value pair is passed. This can also be options if a glob pattern is passed as the first value.
* `returns` **{Object}**: Returns an instance of `Templates` for chaining.

**Example**

```js
app.data('a', 'b');
app.data({c: 'd'});
console.log(app.cache.data);
//=> {a: 'b', c: 'd'}
```

### .context

Build the context for the given `view` and `locals`.

**Params**

* `view` **{Object}**: The view being rendered
* `locals` **{Object}**
* `returns` **{Object}**: The object to be passed to engines/views as context.

### setHelperOptions

Update context in a helper so that `this.helper.options` is
the options for that specific helper.

**Params**

* `context` **{Object}**
* `key` **{String}**

### .mergePartials

Merge "partials" view types. This is necessary for template
engines have no support for partials or only support one
type of partials.

**Params**

* `options` **{Object}**: Optionally pass an array of `viewTypes` to include on `options.viewTypes`
* `returns` **{Object}**: Merged partials

### .mergePartialsAsync

Merge "partials" view types. This is necessary for template engines
have no support for partials or only support one type of partials.

**Params**

* `options` **{Object}**: Optionally pass an array of `viewTypes` to include on `options.viewTypes`
* `callback` **{Function}**: Function that exposes `err` and `partials` parameters

***

### Item

API for the `Item` class.

### Item

Create an instance of `Item`. Optionally pass a default object to use.

**Params**

* `item` **{Object}**

**Example**

```js
var item = new Item({
  path: 'foo.html',
  content: '...'
});
```

### .clone

Re-decorate Item methods after calling vinyl's `.clone()` method.

**Params**

* `options` **{Object}**
* `returns` **{Object}** `item`: Cloned instance

**Example**

```js
item.clone({deep: true}); // false by default
```

### .data

Set, get and load data to be passed to templates as context at render-time.

**Params**

* `key` **{String|Object}**: Pass a key-value pair or an object to set.
* `val` **{any}**: Any value when a key-value pair is passed. This can also be options if a glob pattern is passed as the first value.
* `returns` **{Object}**: Returns an instance of `Templates` for chaining.

**Example**

```js
app.data('a', 'b');
app.data({c: 'd'});
console.log(app.cache.data);
//=> {a: 'b', c: 'd'}
```

### .context

Build the context for the given `view` and `locals`.

**Params**

* `view` **{Object}**: The view being rendered
* `locals` **{Object}**
* `returns` **{Object}**: The object to be passed to engines/views as context.

### setHelperOptions

Update context in a helper so that `this.helper.options` is
the options for that specific helper.

**Params**

* `context` **{Object}**
* `key` **{String}**

### .mergePartials

Merge "partials" view types. This is necessary for template
engines have no support for partials or only support one
type of partials.

**Params**

* `options` **{Object}**: Optionally pass an array of `viewTypes` to include on `options.viewTypes`
* `returns` **{Object}**: Merged partials

### .mergePartialsAsync

Merge "partials" view types. This is necessary for template engines
have no support for partials or only support one type of partials.

**Params**

* `options` **{Object}**: Optionally pass an array of `viewTypes` to include on `options.viewTypes`
* `callback` **{Function}**: Function that exposes `err` and `partials` parameters

***

### Views

API for the `Views` class.

### Views

Create an instance of `Views` with the given `options`.

**Params**

* `options` **{Object}**

**Example**

```js
var collection = new Views();
collection.addView('foo', {content: 'bar'});
```

### .setView

Set a view on the collection. This is identical to [addView](#addView) except `setView` does not emit an event for each view.

**Params**

* `key` **{String|Object}**: View key or object
* `value` **{Object}**: If key is a string, value is the view object.
* `returns` **{Object}**: returns the `view` instance.

**Example**

```js
collection.setView('foo', {content: 'bar'});
```

### .addView

Similar to [setView](#setView), adds a view to the collection but also fires an event and iterates over the loading `queue` for loading views from the `addView` event listener. If the given view is not already an instance of `View`, it will be converted to one before being added to the `views` object.

**Params**

* `key` **{String}**
* `value` **{Object}**
* `returns` **{Object}**: Returns the instance of the created `View` to allow chaining view methods.

**Example**

```js
var views = new Views(...);
views.addView('a.html', {path: 'a.html', contents: '...'});
```

### .deleteView

Delete a view from collection `views`.

**Params**

* `key` **{String}**
* `returns` **{Object}**: Returns the instance for chaining

**Example**

```js
views.deleteView('foo.html');
```

### .addViews

Load multiple views onto the collection.

**Params**

* `views` **{Object|Array}**
* `returns` **{Object}**: returns the `collection` object

**Example**

```js
collection.addViews({
  'a.html': {content: '...'},
  'b.html': {content: '...'},
  'c.html': {content: '...'}
});
```

### .addList

Load an array of views onto the collection.

**Params**

* `list` **{Array}**
* `returns` **{Object}**: returns the `views` instance

**Example**

```js
collection.addList([
  {path: 'a.html', content: '...'},
  {path: 'b.html', content: '...'},
  {path: 'c.html', content: '...'}
]);
```

### .groupBy

Group all collection `views` by the given property, properties or compare functions. See [group-array](https://github.com/doowb/group-array) for the full range of available features and options.

* `returns` **{Object}**: Returns an object of grouped views.

**Example**

```js
var collection = new Collection();
collection.addViews(...);
var groups = collection.groupBy('data.date', 'data.slug');
```

### .getView

Get view `name` from `collection.views`.

**Params**

* `key` **{String}**: Key of the view to get.
* `fn` **{Function}**: Optionally pass a function to modify the key.
* `returns` **{Object}**

**Example**

```js
collection.getView('a.html');
```

### .extendView

Load a view from the file system.

**Params**

* `view` **{Object}**
* `returns` **{Object}**

**Example**

```js
collection.loadView(view);
```

### .isType

Return true if the collection belongs to the given view `type`.

**Params**

* `type` **{String}**: (`renderable`, `partial`, `layout`)

**Example**

```js
collection.isType('partial');
```

### .viewTypes

Alias for `viewType`

### .data

Set, get and load data to be passed to templates as context at render-time.

**Params**

* `key` **{String|Object}**: Pass a key-value pair or an object to set.
* `val` **{any}**: Any value when a key-value pair is passed. This can also be options if a glob pattern is passed as the first value.
* `returns` **{Object}**: Returns an instance of `Templates` for chaining.

**Example**

```js
app.data('a', 'b');
app.data({c: 'd'});
console.log(app.cache.data);
//=> {a: 'b', c: 'd'}
```

### .context

Build the context for the given `view` and `locals`.

**Params**

* `view` **{Object}**: The view being rendered
* `locals` **{Object}**
* `returns` **{Object}**: The object to be passed to engines/views as context.

### setHelperOptions

Update context in a helper so that `this.helper.options` is
the options for that specific helper.

**Params**

* `context` **{Object}**
* `key` **{String}**

### .mergePartials

Merge "partials" view types. This is necessary for template
engines have no support for partials or only support one
type of partials.

**Params**

* `options` **{Object}**: Optionally pass an array of `viewTypes` to include on `options.viewTypes`
* `returns` **{Object}**: Merged partials

### .mergePartialsAsync

Merge "partials" view types. This is necessary for template engines
have no support for partials or only support one type of partials.

**Params**

* `options` **{Object}**: Optionally pass an array of `viewTypes` to include on `options.viewTypes`
* `callback` **{Function}**: Function that exposes `err` and `partials` parameters

***

### .find

Find a view by `name`, optionally passing a `collection` to limit the search. If no collection is passed all `renderable` collections will be searched.

**Params**

* `name` **{String}**: The name/key of the view to find
* `colleciton` **{String}**: Optionally pass a collection name (e.g. pages)
* `returns` **{Object|undefined}**: Returns the view if found, or `undefined` if not.

**Example**

```js
var page = app.find('my-page.hbs');

// optionally pass a collection name as the second argument
var page = app.find('my-page.hbs', 'pages');
```

### .getView

Get view `key` from the specified `collection`.

**Params**

* `collection` **{String}**: Collection name, e.g. `pages`
* `key` **{String}**: Template name
* `fn` **{Function}**: Optionally pass a `renameKey` function
* `returns` **{Object}**

**Example**

```js
var view = app.getView('pages', 'a/b/c.hbs');

// optionally pass a `renameKey` function to modify the lookup
var view = app.getView('pages', 'a/b/c.hbs', function(fp) {
  return path.basename(fp);
});
```

### .getViews

Get all views from a `collection` using the collection's singular or plural name.

**Params**

* `name` **{String}**: The collection name, e.g. `pages` or `page`
* `returns` **{Object}**

**Example**

```js
var pages = app.getViews('pages');
//=> { pages: {'home.hbs': { ... }}

var posts = app.getViews('posts');
//=> { posts: {'2015-10-10.md': { ... }}
```

***

### Collections

API for the `Collections` class.

### Collection

Create an instance of `Collection` with the given `options`.

**Params**

* `options` **{Object}**

**Example**

```js
var collection = new Collection();
collection.addItem('foo', {content: 'bar'});
```

### .setItem

Set an item on the collection. This is identical to [addItem](#addItem) except `setItem` does not emit an event for each item and does not iterate over the item `queue`.

**Params**

* `key` **{String|Object}**: Item key or object
* `value` **{Object}**: If key is a string, value is the item object.
* `returns` **{Object}**: returns the `item` instance.

**Example**

```js
collection.setItem('foo', {content: 'bar'});
```

### .addItem

Similar to `setItem`, adds an item to the collection but also fires an event and iterates over the item `queue` to load items from the `addItem` event listener.  An item may be an instance of `Item`, if not, the item is converted to an instance of `Item`.

**Params**

* `key` **{String}**
* `value` **{Object}**

**Example**

```js
var list = new List(...);
list.addItem('a.html', {path: 'a.html', contents: '...'});
```

### .deleteItem

Delete an item from collection `items`.

**Params**

* `key` **{String}**
* `returns` **{Object}**: Returns the instance for chaining

**Example**

```js
items.deleteItem('abc');
```

### .addItems

Load multiple items onto the collection.

**Params**

* `items` **{Object|Array}**
* `returns` **{Object}**: returns the instance for chaining

**Example**

```js
collection.addItems({
  'a.html': {content: '...'},
  'b.html': {content: '...'},
  'c.html': {content: '...'}
});
```

### .addList

Load an array of items onto the collection.

**Params**

* `items` **{Array}**: or an instance of `List`
* `fn` **{Function}**: Optional sync callback function that is called on each item.
* `returns` **{Object}**: returns the Collection instance for chaining

**Example**

```js
collection.addList([
  {path: 'a.html', content: '...'},
  {path: 'b.html', content: '...'},
  {path: 'c.html', content: '...'}
]);
```

### .getItem

Get an item from the collection.

**Params**

* `key` **{String}**: Key of the item to get.
* `returns` **{Object}**

**Example**

```js
collection.getItem('a.html');
```

### .data

Set, get and load data to be passed to templates as context at render-time.

**Params**

* `key` **{String|Object}**: Pass a key-value pair or an object to set.
* `val` **{any}**: Any value when a key-value pair is passed. This can also be options if a glob pattern is passed as the first value.
* `returns` **{Object}**: Returns an instance of `Templates` for chaining.

**Example**

```js
app.data('a', 'b');
app.data({c: 'd'});
console.log(app.cache.data);
//=> {a: 'b', c: 'd'}
```

### .context

Build the context for the given `view` and `locals`.

**Params**

* `view` **{Object}**: The view being rendered
* `locals` **{Object}**
* `returns` **{Object}**: The object to be passed to engines/views as context.

### setHelperOptions

Update context in a helper so that `this.helper.options` is
the options for that specific helper.

**Params**

* `context` **{Object}**
* `key` **{String}**

### .mergePartials

Merge "partials" view types. This is necessary for template
engines have no support for partials or only support one
type of partials.

**Params**

* `options` **{Object}**: Optionally pass an array of `viewTypes` to include on `options.viewTypes`
* `returns` **{Object}**: Merged partials

### .mergePartialsAsync

Merge "partials" view types. This is necessary for template engines
have no support for partials or only support one type of partials.

**Params**

* `options` **{Object}**: Optionally pass an array of `viewTypes` to include on `options.viewTypes`
* `callback` **{Function}**: Function that exposes `err` and `partials` parameters

***

### List

API for the `List` class.

### List

Create an instance of `List` with the given `options`. Lists differ from collections in that items are stored as an array, allowing items to be paginated, sorted, and grouped.

**Params**

* `options` **{Object}**

**Example**

```js
var list = new List();
list.addItem('foo', {content: 'bar'});
```

### .setItem

Set an item on the collection. This is identical to [addItem](#addItem) except `setItem` does not emit an event for each item and does not iterate over the item `queue`.

**Params**

* `key` **{String|Object}**: Item key or object
* `value` **{Object}**: If key is a string, value is the item object.
* `returns` **{Object}**: returns the `item` instance.

**Example**

```js
collection.setItem('foo', {content: 'bar'});
```

### .addItem

Similar to [setItem](#setItem), adds an item to the list but also fires an event and iterates over the item `queue` to load items from the `addItem` event listener. If the given item is not already an instance of `Item`, it will be converted to one before being added to the `items` object.

**Params**

* `key` **{String}**
* `value` **{Object}**
* `returns` **{Object}**: Returns the instance of the created `Item` to allow chaining item methods.

**Example**

```js
var items = new Items(...);
items.addItem('a.html', {path: 'a.html', contents: '...'});
```

### .addItems

Load multiple items onto the collection.

**Params**

* `items` **{Object|Array}**
* `returns` **{Object}**: returns the instance for chaining

**Example**

```js
collection.addItems({
  'a.html': {content: '...'},
  'b.html': {content: '...'},
  'c.html': {content: '...'}
});
```

### .addList

Load an array of items or the items from another instance of `List`.

**Params**

* `items` **{Array}**: or an instance of `List`
* `fn` **{Function}**: Optional sync callback function that is called on each item.
* `returns` **{Object}**: returns the List instance for chaining

**Example**

```js
var foo = new List(...);
var bar = new List(...);
bar.addList(foo);
```

### .hasItem

Return true if the list has the given item (name).

**Params**

* `key` **{String}**
* `returns` **{Object}**

**Example**

```js
list.addItem('foo.html', {content: '...'});
list.hasItem('foo.html');
//=> true
```

### .getIndex

Get a the index of a specific item from the list by `key`.

**Params**

* `key` **{String}**
* `returns` **{Object}**

**Example**

```js
list.getIndex('foo.html');
//=> 1
```

### .getItem

Get a specific item from the list by `key`.

**Params**

* `key` **{String}**: The item name/key.
* `returns` **{Object}**

**Example**

```js
list.getItem('foo.html');
//=> '<Item <foo.html>>'
```

### .getView

Proxy for `getItem`

**Params**

* `key` **{String}**: Pass the key of the `item` to get.
* `returns` **{Object}**

**Example**

```js
list.getItem('foo.html');
//=> '<Item "foo.html" <buffer e2 e2 e2>>'
```

### .deleteItem

Remove an item from the list.

**Params**

* `key` **{Object|String}**: Pass an `item` instance (object) or `item.key` (string).

**Example**

```js
list.deleteItem('a.html');
```

### .extendItem

Decorate each item on the list with additional methods
and properties. This provides a way of easily overriding
defaults.

**Params**

* `item` **{Object}**
* `returns` **{Object}**: Instance of item for chaining

### .groupBy

Group all list `items` using the given property, properties or compare functions. See [group-array](https://github.com/doowb/group-array) for the full range of available features and options.

* `returns` **{Object}**: Returns the grouped items.

**Example**

```js
var list = new List();
list.addItems(...);
var groups = list.groupBy('data.date', 'data.slug');
```

### .sortBy

Sort all list `items` using the given property, properties or compare functions. See [array-sort](https://github.com/jonschlinkert/array-sort) for the full range of available features and options.

* `returns` **{Object}**: Returns a new `List` instance with sorted items.

**Example**

```js
var list = new List();
list.addItems(...);
var result = list.sortBy('data.date');
//=> new sorted list
```

### .paginate

Paginate all `items` in the list with the given options, See [paginationator](https://github.com/doowb/paginationator) for the full range of available features and options.

* `returns` **{Object}**: Returns the paginated items.

**Example**

```js
var list = new List(items);
var pages = list.paginate({limit: 5});
```

### .data

Set, get and load data to be passed to templates as context at render-time.

**Params**

* `key` **{String|Object}**: Pass a key-value pair or an object to set.
* `val` **{any}**: Any value when a key-value pair is passed. This can also be options if a glob pattern is passed as the first value.
* `returns` **{Object}**: Returns an instance of `Templates` for chaining.

**Example**

```js
app.data('a', 'b');
app.data({c: 'd'});
console.log(app.cache.data);
//=> {a: 'b', c: 'd'}
```

### .context

Build the context for the given `view` and `locals`.

**Params**

* `view` **{Object}**: The view being rendered
* `locals` **{Object}**
* `returns` **{Object}**: The object to be passed to engines/views as context.

### setHelperOptions

Update context in a helper so that `this.helper.options` is
the options for that specific helper.

**Params**

* `context` **{Object}**
* `key` **{String}**

### .mergePartials

Merge "partials" view types. This is necessary for template
engines have no support for partials or only support one
type of partials.

**Params**

* `options` **{Object}**: Optionally pass an array of `viewTypes` to include on `options.viewTypes`
* `returns` **{Object}**: Merged partials

### .mergePartialsAsync

Merge "partials" view types. This is necessary for template engines
have no support for partials or only support one type of partials.

**Params**

* `options` **{Object}**: Optionally pass an array of `viewTypes` to include on `options.viewTypes`
* `callback` **{Function}**: Function that exposes `err` and `partials` parameters

***

### Group

API for the `Group` class.

### Group

Create an instance of `Group` with the given `options`.

**Params**

* `options` **{Object}**

**Example**

```js
var group = new Group({
  'foo': { items: [1,2,3] }
});
```

***

### .find

Find a view by `name`, optionally passing a `collection` to limit the search. If no collection is passed all `renderable` collections will be searched.

**Params**

* `name` **{String}**: The name/key of the view to find
* `colleciton` **{String}**: Optionally pass a collection name (e.g. pages)
* `returns` **{Object|undefined}**: Returns the view if found, or `undefined` if not.

**Example**

```js
var page = app.find('my-page.hbs');

// optionally pass a collection name as the second argument
var page = app.find('my-page.hbs', 'pages');
```

### .getView

Get view `key` from the specified `collection`.

**Params**

* `collection` **{String}**: Collection name, e.g. `pages`
* `key` **{String}**: Template name
* `fn` **{Function}**: Optionally pass a `renameKey` function
* `returns` **{Object}**

**Example**

```js
var view = app.getView('pages', 'a/b/c.hbs');

// optionally pass a `renameKey` function to modify the lookup
var view = app.getView('pages', 'a/b/c.hbs', function(fp) {
  return path.basename(fp);
});
```

### .getViews

Get all views from a `collection` using the collection's singular or plural name.

**Params**

* `name` **{String}**: The collection name, e.g. `pages` or `page`
* `returns` **{Object}**

**Example**

```js
var pages = app.getViews('pages');
//=> { pages: {'home.hbs': { ... }}

var posts = app.getViews('posts');
//=> { posts: {'2015-10-10.md': { ... }}
```

***

### .compile

Compile `content` with the given `locals`.

**Params**

* `view` **{Object|String}**: View object.
* `locals` **{Object}**
* `isAsync` **{Boolean}**: Load async helpers
* `returns` **{Object}**: View object with compiled `view.fn` property.

**Example**

```js
var indexPage = app.page('some-index-page.hbs');
var view = app.compile(indexPage);
// view.fn => [function]

// you can call the compiled function more than once
// to render the view with different data
view.fn({title: 'Foo'});
view.fn({title: 'Bar'});
view.fn({title: 'Baz'});
```

### .compileAsync

Asynchronously compile `content` with the given `locals` and callback.

**Params**

* `view` **{Object|String}**: View object.
* `locals` **{Object}**
* `isAsync` **{Boolean}**: Pass true to load helpers as async (mostly used internally)
* `callback` **{Function}**: function that exposes `err` and the `view` object with compiled `view.fn` property

**Example**

```js
var indexPage = app.page('some-index-page.hbs');
app.compileAsync(indexPage, function(err, view) {
  // view.fn => compiled function
});
```

### .render

Render a view with the given `locals` and `callback`.

**Params**

* `view` **{Object|String}**: Instance of `View`
* `locals` **{Object}**: Locals to pass to template engine.
* `callback` **{Function}**

**Example**

```js
var blogPost = app.post.getView('2015-09-01-foo-bar');
app.render(blogPost, {title: 'Foo'}, function(err, view) {
  // `view` is an object with a rendered `content` property
});
```

***

### .data

Set, get and load data to be passed to templates as context at render-time.

**Params**

* `key` **{String|Object}**: Pass a key-value pair or an object to set.
* `val` **{any}**: Any value when a key-value pair is passed. This can also be options if a glob pattern is passed as the first value.
* `returns` **{Object}**: Returns an instance of `Templates` for chaining.

**Example**

```js
app.data('a', 'b');
app.data({c: 'd'});
console.log(app.cache.data);
//=> {a: 'b', c: 'd'}
```

### .context

Build the context for the given `view` and `locals`.

**Params**

* `view` **{Object}**: The view being rendered
* `locals` **{Object}**
* `returns` **{Object}**: The object to be passed to engines/views as context.

### setHelperOptions

Update context in a helper so that `this.helper.options` is
the options for that specific helper.

**Params**

* `context` **{Object}**
* `key` **{String}**

### .mergePartials

Merge "partials" view types. This is necessary for template
engines have no support for partials or only support one
type of partials.

**Params**

* `options` **{Object}**: Optionally pass an array of `viewTypes` to include on `options.viewTypes`
* `returns` **{Object}**: Merged partials

### .mergePartialsAsync

Merge "partials" view types. This is necessary for template engines
have no support for partials or only support one type of partials.

**Params**

* `options` **{Object}**: Optionally pass an array of `viewTypes` to include on `options.viewTypes`
* `callback` **{Function}**: Function that exposes `err` and `partials` parameters

***

## Routes

### .handle

Handle a middleware `method` for `view`.

**Params**

* `method` **{String}**: Name of the router method to handle. See [router methods](./docs/router.md)
* `view` **{Object}**: View object
* `callback` **{Function}**: Callback function
* `returns` **{Object}**

**Example**

```js
app.handle('customMethod', view, callback);
```

### .handleView

Deprecated, use `.handleOnce`

### .route

Create a new Route for the given path. Each route contains a separate middleware stack.

See the [route API documentation][route-api] for details on
adding handlers and middleware to routes.

**Params**

* `path` **{String}**
* `returns` **{Object}** `Route`: for chaining

**Example**

```js
app.create('posts');
app.route(/blog/)
  .all(function(view, next) {
    // do something with view
    next();
  });

app.post('whatever', {path: 'blog/foo.bar', content: 'bar baz'});
```

### .all

Special route method that works just like the `router.METHOD()` methods, except that it matches all verbs.

**Params**

* `path` **{String}**
* `callback` **{Function}**
* `returns` **{Object}** `this`: for chaining

**Example**

```js
app.all(/\.hbs$/, function(view, next) {
  // do stuff to view
  next();
});
```

### .param

Add callback triggers to route parameters, where `name` is the name of the parameter and `fn` is the callback function.

**Params**

* `name` **{String}**
* `fn` **{Function}**
* `returns` **{Object}**: Returns the instance of `Templates` for chaining.

**Example**

```js
app.param('title', function(view, next, title) {
  //=> title === 'foo.js'
  next();
});

app.onLoad('/blog/:title', function(view, next) {
  //=> view.path === '/blog/foo.js'
  next();
});
```

***

## is

### .isApp

Static method that returns true if the given value is a `templates` instance (`App`).

**Params**

* `val` **{Object}**: The value to test.
* `returns` **{Boolean}**

**Example**

```js
var templates = require('templates');
var app = templates();

templates.isApp(templates);
//=> false

templates.isApp(app);
//=> true
```

### .isCollection

Static method that returns true if the given value is a templates `Collection` instance.

**Params**

* `val` **{Object}**: The value to test.
* `returns` **{Boolean}**

**Example**

```js
var templates = require('templates');
var app = templates();

app.create('pages');
templates.isCollection(app.pages);
//=> true
```

### .isViews

Static method that returns true if the given value is a templates `Views` instance.

**Params**

* `val` **{Object}**: The value to test.
* `returns` **{Boolean}**

**Example**

```js
var templates = require('templates');
var app = templates();

app.create('pages');
templates.isViews(app.pages);
//=> true
```

### .isList

Static method that returns true if the given value is a templates `List` instance.

**Params**

* `val` **{Object}**: The value to test.
* `returns` **{Boolean}**

**Example**

```js
var templates = require('templates');
var List = templates.List;
var app = templates();

var list = new List();
templates.isList(list);
//=> true
```

### .isGroup

Static method that returns true if the given value is a templates `Group` instance.

**Params**

* `val` **{Object}**: The value to test.
* `returns` **{Boolean}**

**Example**

```js
var templates = require('templates');
var Group = templates.Group;
var app = templates();

var group = new Group();
templates.isGroup(group);
//=> true
```

### .isView

Static method that returns true if the given value is a templates `View` instance.

**Params**

* `val` **{Object}**: The value to test.
* `returns` **{Boolean}**

**Example**

```js
var templates = require('templates');
var app = templates();

templates.isView('foo');
//=> false

var view = app.view('foo', {content: '...'});
templates.isView(view);
//=> true
```

### .isItem

Static method that returns true if the given value is a templates `Item` instance.

**Params**

* `val` **{Object}**: The value to test.
* `returns` **{Boolean}**

**Example**

```js
var templates = require('templates');
var app = templates();

templates.isItem('foo');
//=> false

var view = app.view('foo', {content: '...'});
templates.isItem(view);
//=> true
```

### .isVinyl

Static method that returns true if the given value is a vinyl `File` instance.

**Params**

* `val` **{Object}**: The value to test.
* `returns` **{Boolean}**

**Example**

```js
var File = require('vinyl');
var templates = require('templates');
var app = templates();

var view = app.view('foo', {content: '...'});
templates.isVinyl(view);
//=> true

var file = new File({path: 'foo', contents: new Buffer('...')});
templates.isVinyl(file);
//=> true
```
