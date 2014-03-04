###
 Assemble <http://assemble.io>

 Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors
 Licensed under the MIT License (MIT).
 ###

'use strict'

module.exports = (assemble) ->
  # events commented out for demo purposes
  events = assemble.config.plugins.events
  options =
    events: [
      # add events from the events "enum"
      # events.assembleBeforeConfiguration
      # events.assembleAfterConfiguration
      # or add them directly with a string and/or wildcards
      # 'assemble:*:build'
    ]

  assemble.registerPlugin 'coffeescript-example', 'This is a plugin written in CoffeeScript', options, (params, next) ->
    console.log 'CoffeeScript Example Plugin: ', params.event
    next()
