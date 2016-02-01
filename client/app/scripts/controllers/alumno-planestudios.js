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
  angular.module('unuApp').controller('AlumnoPlanestudiosCtrl', ['$mdSidenav', '$q', 'MessageFactory', '$rootScope', '$scope', 'Restangular', '$mdDialog', '$timeout', 'NgTableParams', 'LxDialogService', 'ToastMD', '$mdBottomSheet', '$state',
    function($mdSidenav, $q, MessageFactory, $rootScope, $scope, Restangular, $mdDialog, $timeout, NgTableParams, LxDialogService, ToastMD, $mdBottomSheet, $state) {
      var List, service;

      $scope.UI = {
        refresh: false,
        message: MessageFactory,
        title: 'Plan de Estudios',
        editMode: false,
        selected: null,
        customActions: []
      };

      var LOCAL = {
        name: 'Plan de Estudios',
        form: 'views/alumno/planestudios.html',
        route: 'planestudios'
      };
      service = Restangular.all(LOCAL.route);
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
        var serviceEscuela = Restangular.all('escuelas');
        serviceEscuela.getList({
          conditions: {
            _facultad: $scope.filter._facultad._id
          }
        }).then(function(data) {
          $scope.escuelas = data;
        });
      };
      $scope.ListPlanEstudios = function ListPlanEstudios() {
        var servicePlanestudios = Restangular.all('planestudios');
        servicePlanestudios.getList({
            conditions: {
              _escuela: $scope.filter._escuela._id
            }
          })
          .then(function(data) {
            $scope.planestudios = data;
          });
      };
      new LoadFacultades();
      new LoadPeriodos();

      $scope.ListDetallePlanEstudios = function ListDetallePlanEstudios() {
        $scope.tableParams = new NgTableParams({
          page: 1,
          count: 1000,
          filter: {
              _planestudio: $scope.filter._planestudios._id
          }
        }, {
          total: 0,
          groupBy: 'ciclo',
          counts: [],
          getData: function($defer, params) {
            var query;
            query = params.url();

            $scope.UI.refresh = true;
            service.customGET('methods/aprobacion/'+$scope.filter._periodo._id, query).then(function(result) {
              $timeout(function() {
                params.total(result.total);
                $defer.resolve(result.data);
                $scope.UI.refresh = false;
              }, 500);
            });
          }
        });
      };

      $scope.Refresh = function Refresh() {
        $scope.UI.selected = null;
        $scope.UI.editMode = false;
        $scope.tableParams.reload();
      };

      $scope.filter = {};

    }
  ]);

}).call(this);
