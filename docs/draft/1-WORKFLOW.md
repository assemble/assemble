# Workflow API

> setup workflows for reading, copying, processing and writing files


It might help to think of the Workflow API as "the moving parts" of the build process.

- `.task`
- `.src`
- `.dest`
- `.watch`


***


## .task

Tasks are the basic building blocks of a workflow.

**Example**

```js
assemble.task('less', function() {
  // Within a task, we can:
  // read files
  assemble.src('styles/*.less')
    // process files with plugins
    .pipe(less());
    .pipe(minify());
    // ..and write files back to disk
    .pipe(assemble.dest('dist/assets/css'));
});
```
