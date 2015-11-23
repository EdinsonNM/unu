'use strict'

describe 'Controller: PlanestudiosCtrl', ->

  # load the controller's module
  beforeEach module 'unuApp'

  PlanestudiosCtrl = {}
  scope = {}

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    PlanestudiosCtrl = $controller 'PlanestudiosCtrl', {
      $scope: scope
    }

  it 'should attach a list of awesomeThings to the scope', ->
    expect(scope.awesomeThings.length).toBe 3
