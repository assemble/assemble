module.exports = {
  collections: [
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
  ]
};