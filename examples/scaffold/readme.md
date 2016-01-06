# HTML5 Boilerplate

This recipe shows how to create a boilerplate configuration object from Google's popular [h5bp][], that will make the boilerplate easier to extend, customize and share.

**Three steps**

- [x] Configure the boilerplate (this is already done for you in [bp.js](./bp.js). Please feel free to customize it!)
- [ ] Download the [h5bp][] repository
- [ ] "Expand" it, but running `node bp.js` in the command line

Let's walk through steps **[2](#download)** and **[3](#expand)**.

## Download

 download the project with enter the following in the command line to download Google's popular [h5bp](https://github.com/h5bp/html5-boilerplate)

```sh
$ git clone https://github.com/h5bp/html5-boilerplate.git src
```

## Expand

By "expand", we mean that glob patterns in the boilerplate will be resolved to actual file paths. To do this, run:

```sh
$ node bp.js
```

## Inspecting the boilerplate

The boilerplate configuration object is organized into "scaffolds", you can inspect these by doing the following:

```js
// inspect the boilerplate
console.log(boilerplate);

// inspect specific scaffolds
console.log(boilerplate.css);
console.log(boilerplate.html);

// inspect files arrays on specific scaffolds
console.log(boilerplate.css.files);
console.log(boilerplate.html.files);
```

[h5bp]: https://github.com/h5bp/html5-boilerplate