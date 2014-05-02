###
Assemble <http://assemble.io>

Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
Licensed under the MIT License (MIT).
###

'use strict'

module.exports = (assemble) ->
  # events commented out for demo purposes
  events = assemble.utils.middleware.events

  middleware = (params, next) ->
    console.log 'CoffeeScript Example Middleware: ', params.event
    next()

  middleware.options =
    name: 'coffeescript-example'
    description: 'This is a middleware written in CoffeeScript.'
    events: [
      # add events from the events "enum"
      # events.assembleBeforeConfiguration
      # events.assembleAfterConfiguration
      # or add them directly with a string and/or wildcards
      # 'assemble:*:build'
    ]

  return
    'coffeescript-example': middleware
