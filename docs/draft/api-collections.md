**Example:**

```js
assemble.collections([
  {
    name: 'tag',
    plural: 'tags',
    // Index of all tags
    index: { ... },
    // Index of pages related to each tag
    related_pages: { ... }
  },
  {
    name: 'archive',
    plural: 'archives',
    // Index of all archives
    index: { ... },
    // Index of pages related to each archive
    related_pages: { ... }
  }
]);
```
