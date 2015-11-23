'use strict'

describe 'Service: AuthInterceptor', ->

  # load the service's module
  beforeEach module 'unuApp'

  # instantiate service
  AuthInterceptor = {}
  beforeEach inject (_AuthInterceptor_) ->
    AuthInterceptor = _AuthInterceptor_

  it 'should do something', ->
    expect(!!AuthInterceptor).toBe true
