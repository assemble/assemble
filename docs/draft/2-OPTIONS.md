# Config API

> get and set globally available options and config values

- `.option`
- `.enable` / `.enabled`
- `.disable` / `.disabled`
- `.get`
- `.set`



***

## .option

**Example**

Set custom delimiters to be used in templates. (depends on engine!)


```js
assemble.option('delims', ['<%', '%>']);

var delims = assemble.option('delims');
//=> ['<%', '%>']
```


***


## .enable

```js
assemble.enable('debug');
{options: {debug: true}}
console.log(assemble.enabled('debug'));
//=> true
console.log(assemble.disabled('debug'));
//=> false
```


***


## .disable

```js
assemble.disable('admin mode');
console.log(assemble.enabled('admin mode'));
//=> false
console.log(assemble.disabled('admin mode'));
//=> true
```
