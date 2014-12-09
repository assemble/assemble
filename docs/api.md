# Assemble API

> Overview of the assemble API

Assemble's v0.6.0 API is a superset comprised of the following concepts:

- [Workflow API](#workflow-api) 
- [Config API](#options-api) 
- [Data API](#data-api) 
- [Template API](#template-api) 
- [Middleware API](#middleware-api) 


## Workflow API 

> Read, copy, process and write files

The Workflow API handles "the moving parts" of the build process and consists the following methods:

- `.task`
- `.src`
- `.dest`
- `.watch`

**Example**

```js
assemble.task('default', function() {
  assemble.src('templates/*.hbs')
    .pipe(assemble.dest('templates/*.hbs'))
});
```

**Learn more**

- [defining-tasks](./defining-tasks.md)
- [sessions](./task-sessions.md) (TODO: @doowb)


**Related**

- [plugins](./authoring-plugins.md)


## Config API 

> Get and set globally available options and config values

The Config API provides methods for setting and getting configuration values that can be used anywhere during the build process. 

**Defining options**

- `.option`
- `.enable` and `.enabled`
- `.disable` and `.disabled`
- `.get`
- `.set`

The `.get()` and `.set()` methods are used for getting and setting values on the `assemble.cache` object. This object is "reserved" for you to store whatever values you need. 

**Usage**

```js
assemble.set('drink', 'Tea, Earl Grey, hot.');

var drink = assemble.get('drink');
//=> 'Tea, Earl Grey, hot.'
```

## Template API 

> Define, load and render templates

- `.create`
- `.page`
- `.partial`
- `.layout`
- `.engine`
- `.helper`
- `.render`


## Data API 

> Define load, transform and process data to be passed as context to templates at runtime

- `.data`
- `.transform`


## Middleware API 

- `.use`
- `.route`
- `.all`
- `.onLoad`
- `.preRender` 
- `.postRender` 


## Libraries used

> TODO

- **Workflow API**

  + vinyl, vinyl-fs: file format
  + orchestrator: `.task`, `.src`, `.dest` methods

- **Config API**

  + options-cache

- **Data API**

  + plasma

- **Template API**

  + template
  + helper-cache
  + engine-cache
  + loader-cache

- **Middleware API**

  + en-route (route)

