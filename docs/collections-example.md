## Collections Plugin


* filter by `date` === `december`
* filter by `views` > 1000
* filter by `name` starts with `A`


```js
function sift(obj, fn) {
  return fn ? fn(obj) : filterByName(obj);
}
```



```js
collections: [
  {
    name: 'tag',
    plural: 'tags'
    filter: function() {},

    // Index of all tags
    index: {
      template: 'index',
      pagination: {
        prop: ':num',
        limit: 10,
        sortby: 'some.prop',
        sortOrder: 'ASC'
      },
      permalinks: {
        structure: ':a/tags/:num/index.html'
      }
    },

    // Index of pages related to each tag
    related_pages: {
      template: 'related-pages',
      pagination: {
        limit: 10,
        sortby: 'some.prop',
        sortOrder: 'ASC'
      },
      permalinks: {
        structure: ':a/tags/:tag/index.html'
      }
    }
  },
  {
    name: 'tag',
    plural: 'tags'
    filters: [],

    // Index of all tags
    index: {
      template: 'index',
      pagination: {
        prop: ':num',
        limit: 10,
        sortby: 'some.prop',
        sortOrder: 'ASC'
      },
      permalinks: {
        structure: ':a/tags/:num/index.html'
      }
    },

    // Index of pages related to each tag
    related_pages: {
      template: 'related-pages',
      pagination: {
        limit: 10,
        sortby: 'some.prop',
        sortOrder: 'ASC'
      },
      permalinks: {
        structure: ':a/tags/:tag/index.html'
      }
    }
  }
];


var dec = function (file) {
  return /[dec]/.test(file.data.date);
};

var jan = function (file) {
  return /[jan]/.test(file.data.date);
};

var feb = function (file) {
  return /[feb]/.test(file.data.date);
};


assemble.task('blog', function () {
  assemble.src('*.hbs')
    .pipe(filter('a', dec))
    .pipe(filter('b', jan))
    .pipe(filter('c', feb))
    .pipe(filter('c', require('./collection')))
    .pipe(sort())
    .pipe(assemble.dest('blog/posts'));
});
```

## Plugins

* [filters](): adds a `filters` property to the `collections` plugin
* [indexer](): adds indexing to the `collections` plugin
* [paginate](): adds pagination to the `collections` plugin