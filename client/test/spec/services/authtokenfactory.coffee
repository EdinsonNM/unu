'use strict'

describe 'Service: AuthTokenFactory', ->

  # load the service's module
  beforeEach module 'unuApp'

  # instantiate service
  AuthTokenFactory = {}
  beforeEach inject (_AuthTokenFactory_) ->
    AuthTokenFactory = _AuthTokenFactory_

  it 'should do something', ->
    expect(!!AuthTokenFactory).toBe true
