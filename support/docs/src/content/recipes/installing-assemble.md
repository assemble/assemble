---
title: Installing assemble
category: recipes
---

## CLI usage

To use assemble's CLI (with the `assemble` command), you must infirst install assemble globally. You can do this with [NPM](https://www.npmjs.com/) or [yarn](yarnpkg.com).

**Install globally with NPM**:

```sh
$ npm install assemble [--global/-g]
```

**Install globally with YARN**:

```sh
$ yarn global add assemble
```

## API usage

If you're not using assemble's CLI, you can install assemble locally:


**Install locally with NPM**:


```sh
$ npm install assemble [--save/-S]
$ npm install assemble [--save-dev/-D]
```

**Install locally with YARN**:

```sh
$ yarn add assemble
$ yarn add assemble [--dev/-D]
```

Then add assemble to your project using [node's](https://nodejs.org/api/modules.html#modules) `require()` system:

```js
var assemble = require('assemble');
// and create an instance of assemble
var app = assemble();
```

