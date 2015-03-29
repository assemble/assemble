# Pages

> Load and render pages with assemble

## Overview

- Pages are stored as objects on the `assemble.views.pages` object (all [template types] follow this convention)
- The `.page()` and `.pages()` methods are used to add pages to the `assemble.views.pages` object.
- Each page must have a unique key. This is usually a file path, but can be anything.
- Pages must be defined as key/value pairs. 
- The `.page()` and `.pages()` methods use Assemble's built-in [loaders] to add pages to the `assemble.views.pages` object, but [custom loaders](./loaders.md#custom-loaders) can be used instead.


## .page

The `.page()` and `.pages()` methods can be used interchangeably to load pages. 


### Defining a page

```js
assemble.page('home.hbs', { content: 'This is the home page.'});
assemble.page('about.hbs', { content: 'This is the about page.'});
assemble.page('contact.hbs', { content: 'This is the contact page.'});
```

Note that `value` can also be a string.

```js
assemble.page('home.hbs', 'This is the home page.');
```

**Define locals**

```js
assemble.page('home.hbs', { 
  content: 'This is the {{title}} page.',
  data: { title: 'home'}
});
```

**Front matter**

```js
assemble.page('home.hbs', { 
  content: '---\ntitle: Home\n---\nThis is the {{title}} page.'
});
```

## .pages

### Define multiple pages

**Glob patterns**

```js
assemble.pages('templates/*.hbs');
```

Pass locals to be associated with the pages being loaded:

```js
assemble.pages('templates/*.hbs', {site: {title: 'Code Project'}});
```

**Defined as an object**

```js
assemble.pages({
  'home.hbs': { content: 'This is the home page.'},
  'about.hbs': { content: 'This is the about page.'},
  'contact.hbs': { content: 'This is the contact page.'},
});
```

## Page helper

Use the `page` [template helper](./template-helpers.md) to inject pages into other templates:

```js
{%= page("toc") %}
```

Get a cached page:

```js
var toc = assemble.views.pages['toc'];
```

Pages are `renderable` templates, so they also have a `.render()` method:

```js
var toc = assemble.views.pages['toc'];
// async
toc.render({}, function(err, content) {
  console.log(content);
});

// or sync
var res = toc.render();
```

**Params**

 - `locals` **{Object}**: Optionally pass locals as the first arg
 - `callback` **{Function}**: If a callback is passed, the template will be rendered async, otherwise sync.


## Related

- [defining and loading pages](./defining-and-loading-templates.md#pages)



[template types]: ./template-types.md
[loaders]: ./loaders.md
