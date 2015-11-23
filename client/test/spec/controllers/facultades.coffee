'use strict'

describe 'Controller: FacultadesCtrl', ->

  # load the controller's module
  beforeEach module 'unuApp'

  FacultadesCtrl = {}
  scope = {}

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    FacultadesCtrl = $controller 'FacultadesCtrl', {
      $scope: scope
    }

  it 'should attach a list of awesomeThings to the scope', ->
    expect(scope.awesomeThings.length).toBe 3
