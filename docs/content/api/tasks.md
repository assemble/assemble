---
title: Task API
collection: docs
category: api
description: >
  Assemble's Task API has methods for running tasks and controlling build workflows.
related:
  list: ['assemble-fs', 'base-pipeline']
  docs: []
---

## Overview

- tasks are stored as objects on the `app.tasks` object
- tasks are run by the `build` method, which takes _one or more task names_ and a callback function as arguments.
- Assemble calls the `build` method for you when you run `assemble` via command line.
- Upon completion, tasks should either invoke a callback function, or return a promise or event stream (this is referred to by [gulp][] as a "run hint", to signal when the next task should run).
- Assemble's task API is powered by [composer][] and [bach][] (the same library that powers [gulp][]).

## Task API

Assemble's Task API includes the following methods:

* [task](#task)
* [build](#build)
* [watch](#watch)

### .task

Define a task to be run.

Tasks are functions that are stored by `key` on the `app.tasks` object, allowing them to be called later by the `build` method.

**Params**

* `key` **{String}**: Task name
* `fn` **{Function}**: Task function to be called by the `build` method

**Example**

```js
app.task('minify', function(cb) {
  // execute javascript code
  cb();
});
```

### .build

Run one or more tasks.

**Params**

* `tasks` **{Array|String}**: Task name or array of task names.
* `callback` **{Function}**: callback function that exposes `err`

**Example**

```js
app.build('default', function(err) {
  if (err) throw err;
  console.log('done!');
});
```

### .watch

Watch files, run one or more tasks when a watched file changes.

**Params**

* `glob` **{String|Array}**: Filepaths or glob patterns.
* `tasks` **{Array}**: One or more tasks to be run when watch detects a changed file that matches the given glob patterns.

**Example**

```js
app.task('watch', function() {
  app.watch('src/*.sass', ['sass']);
});
```

**Good to know**

Try to be as explicit as possible with your glob patterns. "Greedy" patterns with double-globstars (`**/*`) will always slow down your builds. Sometimes drastically.

