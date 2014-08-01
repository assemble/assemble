# settings

The following settings can be defined using `assemble.set()`:

* `env` Environment mode, defaults to `process.env.NODE_ENV` (`NODE_ENV` environment variable) or `development`.
* `view cache` Enables view template compilation caching, enabled in production by default
* `view engine` The default engine extension to use when omitted
* `views` The view directory path, defaulting to "process.cwd() + '/views'"
* `noparse`
* `norender`
