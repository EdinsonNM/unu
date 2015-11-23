'use strict'

describe 'Directive: CustomForm', ->

  # load the directive's module
  beforeEach module 'unuApp'

  scope = {}

  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()

  it 'should make hidden element visible', inject ($compile) ->
    element = angular.element '<-custom-form></-custom-form>'
    element = $compile(element) scope
    expect(element.text()).toBe 'this is the CustomForm directive'
