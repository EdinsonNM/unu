'use strict'

describe 'Directive: ValidateUnique', ->

  # load the directive's module
  beforeEach module 'unuApp'

  scope = {}

  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()

  it 'should make hidden element visible', inject ($compile) ->
    element = angular.element '<-validate-unique></-validate-unique>'
    element = $compile(element) scope
    expect(element.text()).toBe 'this is the ValidateUnique directive'
