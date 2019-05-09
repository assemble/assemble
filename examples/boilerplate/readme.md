# HTML5 Boilerplate

**Heads up!** [h5bp][] already ships with a gulpfile that does everything you'll see here and much more. However, the point of this example is to show how to create and generate boilerplates with assemble when you need to do it from scratch. If this sounds interesting to you, let's pretend that h5bp's gulpfile doesn't exist for a few minutes! That's all we'll need :)

## What to expect

This recipe shows how to create a boilerplate configuration object from Google's popular [h5bp][], that will make the boilerplate easier to extend, customize and share.

**Three steps**

The first step is take care of for you, but you'll need to do 2 and 3:

1. [x] Configure the boilerplate (this is already done for you in [assemblefile.js](./assemblefile.js). Please feel free to customize it!)
1. [ ] Download the [h5bp][] repository
1. [ ] Generate it by running `assemble` in the command line

Let's walk through steps **[2](#download)** and **[3](#build)**.

## Download

First, we need to `git clone` Google's popular [h5bp project](https://github.com/h5bp/html5-boilerplate) (we'll be using the project's `dist` files as our "source" files):

```sh
$ git clone https://github.com/h5bp/html5-boilerplate.git vendor
```

_(Note that we're saving h5bp to the `vendor` directory, since you haven't customized the files yet. But we'll be generating the files into the `src` directory, which is where you'll do your customization. You can change any of these paths to whatever works best for you.)_

## Build

Since the `assemblefile.js` is already configured for you, if you're in the same directory as the `assemblefile.js` just run the following command to generate the files:

```sh
$ assemble
```

If you're in the root of the assemble project, run:

```sh
$ assemble --cwd examples/boilerplate
```

If successful, you should see a `src` directory in `examples/boilerplate` with files generated from h5bp.

[h5bp]: https://github.com/h5bp/html5-boilerplate
