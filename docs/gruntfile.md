## Assemble Gruntfile


TODO...

```js
assemble: {
  options: {
    assets: "path/to/assets",
    data:   "path/to/config.json"
  },
  project: {
    options: {
      layout: "path/to/default-layout.mustache",
      partials: "path/to/partials/**/*.mustache"
    },
    files: {
      'dest': "path/to/pages/**/*.mustache"
      ]
    }
  }
}
```