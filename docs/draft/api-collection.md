**Example:**

```js
assemble.collection({
  name: 'tag',
  plural: 'tags',
  // Index of all tags
  index: {
    template: __dirname + 'layouts/tags.hbs',
    pagination: {
      prop: ':num',
      limit: 10,
      sortby: 'some.prop',
      sortOrder: 'ASC'
    },
    permalinks: {
      structure: ':foo/tags/:num/index.html'
    }
  },
  // Index of pages related to each tag
  related_pages: {
    template: __dirname + 'layouts/tag.hbs',
    pagination: {
      limit: 10,
      sortby: 'some.prop',
      sortOrder: 'ASC'
    },
    permalinks: {
      structure: ':foo/tags/:tag/index.html'
    }
  }
});
```
