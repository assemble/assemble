If `expand` is defined as true, the value will be set using [expander].

**Example**

```js
assemble.set('a', {b: 'c'});

// expand template strings with expander
assemble.set('a', {b: 'c'}, true);
```

Visit the [expander] docs for more info.


[expander]: https://github.com/tkellen/expander
[getobject]: https://github.com/cowboy/node-getobject