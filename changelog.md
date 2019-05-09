#### key

Changelog entries are classified using the following labels _(from [keep-a-changelog][]_):

- `added`: for new features
- `changed`: for changes in existing functionality
- `deprecated`: for once-stable features removed in upcoming releases
- `removed`: for deprecated features removed in this release
- `fixed`: for any bug fixes

Custom labels used in this changelog:

* `dependencies`: bumps dependencies
* `housekeeping`: code re-organization, minor edits, or other changes that don't fit in one of the other categories.

## [0.24.0] - 2017-05-19

**added**
 
- By popular request, assemble now automatically expands config templates in yaml front-matter, via [expand-front-matter][]! This is a feature that we had in grunt-assemble, and users let us know that they wanted it back.

**fixed**

- Updated dependencies to use [is-binary-buffer][], which fixes a bug where `isbinaryfile` was trying to read from a file that didn't exist.

## [0.23.0] - 2017-02-11

**dependencies**

- Bumps [assemble-core][] to get an update to [assemble-streams][] that ensures that `view` is decorated with `.toStream()` when created by `app` (versus a collection).

## [0.21.0] - 2017-02-03

**dependencies**

- Bumps [assemble-loader] to v1.0.0 to take advantage of optimizations, improvements and bug fixes related to loading views

**fixed**

- Regression in 0.20.0 that was causing `view.stat` to be null in some cases after `view.path` changed
- `view.base` was not always correct on views that were not created from the file system 

## [0.20.0] - 2017-02-02

**dependencies**

- Bumps [assemble-core] to v0.29.0 to take advantage of improvements to `dest` handling

## [0.19.0] - 2017-02-01

**dependencies**

- Bumps [assemble-core] to v0.28.0 to take advantage of new methods available on `list`s

### [0.18.0]

**Dependencies**

- bumps [assemble-core][] to 0.27.0

### [0.17.0]

**Dependencies**

- bumps [assemble-core][] to 0.26.0

### [0.16.1]

- bump dependencies. In particular, there was a bug in [parser-front-matter][] where leading whitespace was removed after extracting front-matter, which caused the first line of indentation to be removed. This has been fixed.

### [0.16.0]

- **Added**: `.log()` method, which also exposes additional methods, like `.log.info()`, `.log.success()`, etc. 
- docs were moved to `support/docs`, so that markdown docs can be built to the `docs` directory
- docs were updated, new docs added
- Moves some private prototype methods to static methods, to allow them to be used without creating an instance
- Bumps [assemble-core][] to v0.25.0

### [0.15.0]

- Bumps [assemble-core][] to v0.24.0 to get the latest versions of [templates][] and [base-data][] which removes the `renameKey` option from the `.data` method. Use the `namespace` option instead.

### [0.14.0]

Bumps [assemble-core][] to v0.22.0 to take advantage of fixes and improvements to lookup methods: `.find` and `getView`. No API changes were made. Please [let us know](../../issues) if regressions occur.

- fixes `List` bug that was caused collection helpers to explode
- Improvements to lookup functions: `app.getView()` and `app.find()`
- Bumps [base][] to take advantages of code optimizations.

### [0.13.0]

- Bumps [assemble-core][] to v0.21.0. Support for the `queue` property was removed on collections. See [assemble-core][] for additional details.
- Fixes bug where glob parent was not being used for `file.base`, causing dest directory to be relative to cwd instead of glob parent in some cases.
- Some changes were made to context handling that effected one unit test out of ~1,000. although it's unlikely you'll be effected by the change, it warrants a minor bump
- Externalizes common [templates][] tests to base-test-runner, so that assemble plugins and other [base][] applications can use the tests
- Includes a fix from [assemble-loader][], where a bug caused `renameKey` to not always be used when defined on collection loader options.
- Includes fixes from templates for resolving layouts

### [0.12.0]

- Bumps [assemble-core][] to v0.18.0, which includes a bump in [templates][]. See the changelog on the templates library for more details.

### [0.11.0]

- `debug` methods and related code have been removed
- Bumps [assemble-core][] to v0.17.0

### [0.10.0]

- Adds support for using es6 generators with tasks
- Bumps [assemble-core][] to v0.15.0

### [0.9.0]

- Bumps several dependencies. No API changes, this is mostly an optimization release. Be sure to completely remove `node_modules` and reinstall all dependencies to avoid errors such as `isRegistered is not a function`

### [0.8.0]

- Updates [composer][] to v0.11.0, which removes the `.watch` method in favor of using the [base-watch][] plugin.
- Changes in [templates][]. Please see v0.11.0 in [templates history](https://github.com/jonschlinkert/templates#history) for more details.

### [0.7.0]

- Stability improvements and optimizations of the API introduced in v0.6.0.

### [0.6.0]

- Major refactor. Assemble was completely re-written from the ground-up as a standalone node.js library and is no longer a grunt plugin. Grunt plugin support has been moved to [grunt-assemble][]. Please see that repo for additional details.

[keep-a-changelog]: https://github.com/olivierlacan/keep-a-changelog