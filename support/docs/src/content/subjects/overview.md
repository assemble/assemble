---
title: Overview
category: subjects
---

## CLI and API

> Assemble v0.6.0 will have both an API and a CLI

This is exciting for us, because it means that we can make decisions for Assemble's API based on what's best for Assemble and the community, and from there make decisions about how to best support plugins for other ecosystems, like Grunt and gulp.

Rest assured, we will continue to provide support for gulp and Grunt plugins, only now we'll be able to do so in a way that is more idiomatic to the conventions of each.


## API

In a nutshell, Assemble's v0.6.0 API consists of the following concepts:

 - **Config API**: The config API exposes `.get()`, `.set()` and `.option()` methods for setting general configuation values that may be used by any other method, plugin or extension.
 - **Data API**: The data API exposes methods for loading, transforming and processing data that will ultimately be passed as context to templates at runtime.
 - **Template API**: The template API exposes methods for loading templates and for creating custom template types or collections.
 - **Middleware API**: The middlweare API exposes methods for extending Assemble and individual template objects during specific stages at runtime
 - **Task API**: The task API exposes methods for actually building your projects, and for moving files from point A to point B.

Here is more information about each.


## Config API

> Set and get general configuration values that can be used by any method.

In other words, these methods are generically, and globally usable.

### .option

The `.option()` method sets values on the `assemble.options` object.

```js
// set
assemble.option('abc', true);

// get
assemble.option('abc')); //=> true
assemble.options.abc; //=> true
```

In addition to `.option()`, the following methods may be used as convenience methods for getting and setting _Boolean_ values on the `options` object:

```js
assemble.enable('xyz');
//=> assemble.options.xyz = true;
```

Is `xyz` enabled?

```js
assemble.enabled('xyz');
// 'true'
```

Is `xyz` disabled?

```js
assemble.disabled('xyz');
// 'false'
```

Then let's disable it!

```js
assemble.disable('xyz');
```


### .set / .get

The `.set()` method sets values on the `assemble.cache` object. This object is reserved just for you. Whatever the use case, feel free to `set()` to your heart's content.

```js
assemble.set('level', 'admin');
assemble.get('level');
//=> 'admin'
```

## Data API

> Load data that will ultimately be passed to templates as context at runtime.

### .data

Good for setting data to be used in templates. The `.data()` method takes a string or array of glob patterns (or file paths), or an object of data can be passed directly. Any of these will work:

**Example**

```js
assemble.data({title: 'Blog'});
assemble.data('data/*.{json,yml}');
assemble.data(['config/*.yml', 'data/*.json']);
```

### .transform

Good for updating global data and options. Transforms are executed immediately and passed the current `assemble` upon initialization, so data and options can be updated.

**Example**

```js
// loads package.json data onto `assemble.cache.data`
assemble.transform('load-package-data', function(app) {
  app.data('package.json');
});
```

### Template API

> loading templates and create custom template types or collections

### Template collections and types

One of the most powerful features in Assemble v0.6.0 is the ability to create custom template collections, accomplished via the `.create()` method.

### .create

Good for building semantically-named collections of templates that may need [custom loaders](#loaders), [custom engines](#engines), or to be rendered at different times.

#### collections

When a custom template collection is created via the `.create()` method, as with `assemble.create('cactus')` (an odd name for a template, but that's up to you), a couple of convenience methods will be created for loading templates onto the `cactus` collection. Namely: `assemble.cactus()` and `assemble.cactuss()`. However, given that the spelling of `cactuss` is both wrong and incorrect, you may also choose the plural name by doing: `assemble.create('cactus', 'cacti')`.

Now you can begin loading `cacti` onto the `assemble.views.cacti` object:

```js
assemble.cactus('prickly', 'This is a desription', {foo: 'this is locals'});
// or the plural
assemble.cacti('desert/*.tumbleweed'); // Don't scoff, sindresorhus probably created this already
```

#### types

While collections are just objects, `types` on the other hand, set on the `options` in the `.create()` method, can determine the actual destiny of a template. Imagine the power!

Not in the imagining mood yet? Okay, let's try this. If Assemble was a [MMORPG], `types` would be character classes.

There are three different template types to choose from when creating a new template collection, each imbued with special methods or talents unique to its type:

  - `layout`: Layouts, like tanks, are used to provide cover for other templates. Layouts can stack, or be wrapped with other layouts. Templates of any type may use layouts, and to do so they need only to say the layout's name. Some prefer to inscribe this name discretely in front matter, others prefer to cast it upon the `options` for all templates to see. The choice is yours.
  - `partial`: Partials, like warlocks, may be summoned by other templates. Partials may even summon, or be summoned by other partials.
  - `renderable`: Renderable templates, like druids, are versatile shapeshifters. Being `renderable` imbues templates with a special `.render()` method unique to this type. For example, Assemble's built-in renderable type: `page`, may be retrieved via `var foo = assemble.getPage("foo")` and its render method may be invoked thusly: `foo.render()`.

**Example**

Using our characters, let's create some collections to see how types work:

```js
assemble.create('tank', { isLayout: true });
assemble.create('warlock', { isPartial: true });
assemble.create('druid', { isRenderable: true });
```

**Usage**

Now we can use them like this:

```js
assemble.tank('foo', {content: 'This is a layout, content goes here => {% body %}'});
assemble.warlock('bar', {content: '\n<section>This is a partial</section>'});
assemble.druid('baz', {content: 'This is a renderable template.\n{%= warlock("bar") %}', layout: 'foo'});
```

**Render**

And we can render a specific template like this:

```js
var druid = assemble.getDruid('baz');

druid.render(function (err, content) {
  console.log(content);

  //=> This is a layout, content goes here => This is a renderable template.
  //=> <section>This is a partial</section>
});
```

### .load

Good for customizing the arguments and sources of templates being loaded. Loaders are created by passing an array of one or more functions to the template `.create()` method:

**Example**

```js
assemble.create('post', [
  function(filepath, next) {
    var str = fs.readFileSync(filepath, 'utf8');
    var name = path.basename(filepath, path.extname(filepath));
    var template = {};
    template[name] = {path: filepath, content: str};
    next(null, template);
  },
  function(template, next) {
    // do more stuff with `template`
    next(null, template);
  }
]);
```

**WIP** _We think this will be one of the most powerful features on 0.6. It's usable as-is, but be prepared for it to change. Feedback welcome._

### .helper


```js
assemble.helper('foo', function(str) {
  // do stuff
  return str;
});
```

**Async helpers**

```js
assemble.asyncHelper('renderPosts', function (names, locals, callback) {
  // lookup each post
  var posts = names.map(function (name) {
    return assemble.getPost(name);
  }).filter(Boolean);

  // render all posts and join their contents together
  async.mapSeries(posts, function (post, next) {
    post.render(locals, next);
  }, function (err, results) {
    if (err) return callback(err);
    next(null, results.join('\n'));
  });
});
```


### .engine

> Good for rendering/parsing/building files.

Custom engines can be added and will be run when `render` is called for the matching `ext`

**Example**

```js
assemble.engine('hbs', function(content, locals, cb) {
  // todo
});
```


### .render

> Good for...

(more detail)

**Example**

```js
assemble.task('default', function() {
  assemble.src('templates/*.tmpl')
    .pipe(plugin())
    .pipe(assemble.dest())
});
```


### Middlware API

> Middleware API

### .use

> Good for...

(more detail)

**Example**

```js
assemble.use('', function() {

});
```

### .route

> Good for...

(more detail)

**Example**

```js
assemble.route('', function() {

});
```


## Task API



### .task

> Good for...

(more detail)

**Example**

```js
assemble.task('default', function() {
  assemble.src('templates/*.tmpl')
    .pipe(plugin())
    .pipe(assemble.dest())
});
```

### .src

### .dest

### plugins

> Good for...

(more detail)

**Example**

```js
assemble.task('default', function() {
  assemble.src('templates/*.tmpl')
    .pipe(plugin())
    .pipe(assemble.dest())
});
```


In v0.6.0, we're leveraging the same great libraries used by gulp, authored by the fractal team. So you can use the same task signature, plugin signature and CLI commands as gulp but of course you'll run `assemble` at the command line, instead of `gulp`.


- `.task()`
- `.src()`
- `.dest()`



## Q/A

Please feel free to ask questions, give feedback and help out with this release. If you're interested in helping out with anything, as always please let us know! We will definitely need help and feedback from the community to make this happen!

What else do you want to know about this release?

***

## v0.6.0 checklist

### Build paths

The following properites need to be exposed on the `file` object at runtime.

+ [x] src
  - [x] assets
  - [x] basename
  - [x] dirname
  - [x] ext/extname
  - [x] filename
- [x] dest
  - [x] assets
  - [x] basename
  - [x] dirname
  - [x] ext/extname
  - [x] filename


### Methdods

Data API

- [x] `.option()`
- [x] `.get()`/`.set()`
- [x] `.data()`
- [x] `.transform()`

Template API

- [x] `.load()`
- [x] `.create()` custom template types
- [x] `.helper()`/`.helpers()`
- [x] `.engine()`/`.engines()`
- [x] `.render()`

Middleware API

- [x] `.use()` (middleware)
- [x] `.route()`

Task API

- [x] `.task()`
- [x] `.src()`
- [x] `.dest()`
- [x] plugins


### Plugins / Middleware

- [x] assets
- [ ] permalinks
- [x] dest
- [x] render
- [ ] collections
- [ ] indexes
- [x] drafts


### Options (backwards compatibility)

- [x] assets
- [ ] collections
- [x] helpers
- [x] data
- [x] engine
- [x] ext
- [x] layout
- [ ] layoutdir
- [ ] layoutext
- [x] partials
- [x] pages


[MMORPG]: http://en.wikipedia.org/wiki/Massively_multiplayer_online_role-playing_game



