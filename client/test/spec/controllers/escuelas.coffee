'use strict'

describe 'Controller: EscuelasCtrl', ->

  # load the controller's module
  beforeEach module 'unuApp'

  EscuelasCtrl = {}
  scope = {}

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    EscuelasCtrl = $controller 'EscuelasCtrl', {
      $scope: scope
    }

  it 'should attach a list of awesomeThings to the scope', ->
    expect(scope.awesomeThings.length).toBe 3
