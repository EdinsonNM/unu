// Generated by CoffeeScript 1.9.3
(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name unuApp.controller:FacultadesCtrl
   * @description
   * # FacultadesCtrl
   * Controller of the unuApp
   */
  angular.module('unuApp').controller('RptIngresantesFacultadCrtl', ['$mdSidenav',
    '$q',
    'MessageFactory',
    '$rootScope',
    '$scope',
    'Restangular',
    '$mdDialog',
    '$timeout',
    'NgTableParams',
    'LxDialogService',
    'ToastMD',
    '$mdBottomSheet',
    '$state',

    function($mdSidenav, $q, MessageFactory, $rootScope, $scope, Restangular, $mdDialog, $timeout, NgTableParams, LxDialogService, ToastMD, $mdBottomSheet, $state) {
      $scope.UI = {
        refresh: false,
        message: MessageFactory,
        title: 'Reporte de Matriculados por Grupo',
      };
      var LOCAL = {
        name: "Reporte de Ingresantes por Facultad",
      };

      $rootScope.app.module = ' > ' + LOCAL.name;

      var LoadFacultades = function LoadFacultades() {
        var serviceFacultad = Restangular.all('facultades');
        serviceFacultad.getList().then(function(data) {
          $scope.facultades = data;
        });
      };
      var LoadPeriodos = function LoadPeriodos() {
        var servicePeriodo = Restangular.all('periodos');
        servicePeriodo.getList().then(function(data) {
          $scope.periodos = data;
        });
      };
      $scope.LoadEcuelas = function LoadEcuelas() {
        $scope.ListIngresantes();
        var serviceEscuela = Restangular.all('escuelas');
        serviceEscuela.getList({
          conditions: {
            _facultad: $scope.filter._facultad._id
          }
        }).then(function(data) {
          $scope.escuelas = data;
        });
      };

      $scope.ListIngresantes = function(){
        var service = Restangular.all('ingresantes/methods/reports/ingresantefacultad');
        service.getList({_facultad:$scope.filter._facultad._id,_escuela:($scope.filter._escuela)?$scope.filter._escuela._id:null,_periodo:($scope.filter._periodo)?$scope.filter._periodo._id:null})
        .then(
          function(result){
            console.log(result);
          $scope.data = result;
        },function(result){
          Toast.warning(result.data.message);
        });
      }
      new LoadFacultades();
      new LoadPeriodos();

}]);
}).call(this);