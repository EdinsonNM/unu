'use strict'

describe 'Controller: CursosCtrl', ->

  # load the controller's module
  beforeEach module 'unuApp'

  CursosCtrl = {}
  scope = {}

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    CursosCtrl = $controller 'CursosCtrl', {
      $scope: scope
    }

  it 'should attach a list of awesomeThings to the scope', ->
    expect(scope.awesomeThings.length).toBe 3
