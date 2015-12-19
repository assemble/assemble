That's right! we decided to go straight to v0.6.0. Why? Well, here are a few of the highlights.

## First things first

> Support for previous versions?

We'll be publishing/updating plugins for both.

**Grunt changes**

The main difference for Grunt users will be the need to begin installing `grunt-assemble` instead of just `assemble` - which is how it should have been all along.

> Support for previous versions?

We won't be actively supporting previous versions beyond crucial bug fixes. After all, given that Assemble started as a Grunt plugin, after you get familiarized with 0.6.0 we think you'll agree that focusing on the future is the best us of our time.

## v0.6.0 features

### Highlights

In the upcoming release, here are some of the new features being introduced to Assemble:

  - **CLI** Assemble v0.6.0 has its own CLI. just run `assemble` at the command line.
  - **Plugins/Tasks** Assemble v0.6.0 supports gulp-style plugins
  - **Engines** express-style engine support!
  - **Routes/Middleware** Express-style routes, but for static pages!
  - **Helpers** Enhanced layout support
  - **Transforms** Enhanced layout support
  - **Layouts** Enhanced layout support
  - **Loaders** Enhanced layout support

### Our favorite...

  - **Custom template types** Enhanced layout support



  - **CLI** Assemble v0.6.0 has its own CLI. just run `assemble` at the command line.
  - **Plugins/Tasks** Assemble v0.6.0 supports gulp-style plugins, and can run gulp plugin can be run by Assemble v0.6.0.
  - **Parsers** (kerouac-style): Parsers are like express engines and they're registered the same way as well. Being parsers, they're used for parsing instead of rendering. As an example, the pre-loaded (default) parser will extend the context with data from yaml front matter.
  - **Engines** express-style engine support! Engines support has changed so dramatically in this version that we're considering this a new feature. Assemble v0.6.0 allows any engine from **[Consolidate](https://github.com/visionmedia/consolidate.js)** or **[Transformers](https://github.com/ForbesLindesay/transformers)** to be registered using `assemble.engine()`, just like [express](http://expressjs.com/4x/api.html#app.engine). To author a custom engine, follow the instructions on the [consolidate](https://github.com/visionmedia/consolidate.js) docs or the [transformers](https://github.com/ForbesLindesay/transformers) docs, depending on what you need.
  - **Routes/Middleware** (express/kerouac-style): Express-style routes, but for static pages! In a nutshell, routes allow you to run a stack of middlewares against any pages that match any number of given regex or string patterns. Endless possibilities here (need revving/cache busting anyone?).

This is truly just for starters. There are many "smaller" features, and some of them are more exciting to me than any of the above (like support for **partial layouts**! yep, meaning that partials are able to use layouts - even nested layouts!). Stay tuned for updates!


#### Layouts

Layouts can be used with any kind of template. Pages, partials, or other layouts. Layouts can nest as deeply as you need them to.

## Q/A

Please feel free to ask questions, give feedback and help out with this release. If you're interested in helping out with anything, as always please let us know! We will definitely need help and feedback from the community to make this happen!

What else do you want to know about this release?