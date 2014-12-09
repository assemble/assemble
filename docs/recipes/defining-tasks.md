# Defining tasks

> Generally it's really simple to define a task, but this recipes describes a few options if you need something more advanced

The following assumes that you might have files with different extensions, say `.md` for blog posts and `.hbs` for page templates and layouts. But this info applies to any use case, you could process `.less` and `.coffee` files the same way. 

_Note that when "renderers" are referred to, this typically means a template engine, but the same applies to CSS pre-processors, parser and so on._

**Example 1: same task, same engine**

If the following are true:

 - all files defined in the `src` **can** use the same renderer
 - all files **will** go to the same destination directory

Then we can get by with one task:

```js
assemble.task('pages', function() {
  assemble.src('templates/*.{hbs,md}')
    .pipe(assemble.dest('_gh_pages'));
});
```

**Example 2: same task, multiple engines**

If the following are true:

 - all files defined in the `src` **cannot** use the same renderer
 - all files **will** go to the same destination directory

We can still get by with one task, but we'll need to use a different renderer:

```js
// register a new engine for rendering `.md` files
assemble.engine('md', require('engine-lodash'));

assemble.task('pages', function() {
  assemble.src('templates/*.{hbs,md}')
    .pipe(assemble.dest('_gh_pages'));
});
```

**Example 3: separate tasks, same engine**

If the following are true:

 - all files **will not** go to the same destination directory

We'll need to define multiple tasks.

```js
assemble.task('pages', function() {
  assemble.src('templates/*.hbs')
    .pipe(assemble.dest('_gh_pages'));
});

assemble.task('posts', function() {
  assemble.src('content/*.md')
    .pipe(assemble.dest('_gh_pages/blog/posts'));
});
```

**Example 4: separate tasks, different engines**

```js
// register a new engine for rendering `.md` files
assemble.engine('md', require('engine-lodash'));

assemble.task('pages', function() {
  assemble.src('templates/*.hbs')
    .pipe(assemble.dest('_gh_pages'));
});

assemble.task('posts', function() {
  assemble.src('content/*.md')
    .pipe(assemble.dest('_gh_pages/blog/posts'));
});
```


assemble.data(options.data);
assemble.task(this.current.task.target, function() {
  assemble.src(fp.src)
    .pipe(dest());
    .pipe(assemble.dest(fp.dest));
});
