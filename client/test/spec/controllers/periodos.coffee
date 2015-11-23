'use strict'

describe 'Controller: PeriodosCtrl', ->

  # load the controller's module
  beforeEach module 'unuApp'

  PeriodosCtrl = {}
  scope = {}

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    PeriodosCtrl = $controller 'PeriodosCtrl', {
      $scope: scope
    }

  it 'should attach a list of awesomeThings to the scope', ->
    expect(scope.awesomeThings.length).toBe 3
