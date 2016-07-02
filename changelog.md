### v0.15.0

- Bumps [assemble-core][] to v0.24.0 to get the latest versions of [templates][] and [base-data][] which removes the `renameKey` option from the `.data` method. Use the `namespace` option instead.

### v0.14.0

Bumps [assemble-core][] to v0.22.0 to take advantage of fixes and improvements to lookup methods: `.find` and `getView`. No API changes were made. Please [let us know](../../issues) if regressions occur.

- fixes `List` bug that was caused collection helpers to explode
- Improvements to lookup functions: `app.getView()` and `app.find()`
- Bumps [base][] to take advantages of code optimizations.

### v0.13.0

- Bumps [assemble-core][] to v0.21.0. Support for the `queue` property was removed on collections. See [assemble-core][] for additional details.
- Fixes bug where glob parent was not being used for `file.base`, causing dest directory to be relative to cwd instead of glob parent in some cases.
- Some changes were made to context handling that effected one unit test out of ~1,000. although it's unlikely you'll be effected by the change, it warrants a minor bump
- Externalizes common [templates][] tests to base-test-runner, so that assemble plugins and other [base][] applications can use the tests
- Includes a fix from [assemble-loader][], where a bug caused `renameKey` to not always be used when defined on collection loader options.
- Includes fixes from templates for resolving layouts

### v0.12.0

- Bumps [assemble-core][] to v0.18.0, which includes a bump in [templates][]. See the changelog on the templates library for more details.

### v0.11.0

- `debug` methods and related code have been removed
- Bumps [assemble-core][] to v0.17.0

### v0.10.0

- Adds support for using es6 generators with tasks
- Bumps [assemble-core][] to v0.15.0

### v0.9.0

- Bumps several dependencies. No API changes, this is mostly an optimization release. Be sure to completely remove `node_modules` and reinstall all dependencies to avoid errors such as `isRegistered is not a function`

### v0.8.0

- Updates [composer][] to v0.11.0, which removes the `.watch` method in favor of using the [base-watch][] plugin.
- Changes in [templates][]. Please see v0.11.0 in [templates history](https://github.com/jonschlinkert/templates#history) for more details.

### v0.7.0

- Stability improvements and optimizations of the API introduced in v0.6.0.

### v0.6.0

- Major refactor. Assemble was completely re-written from the ground-up as a standalone node.js library and is no longer a grunt plugin. Grunt plugin support has been moved to [grunt-assemble][]. Please see that repo for additional details.
