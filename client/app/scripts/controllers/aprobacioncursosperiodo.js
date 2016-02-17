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
  angular.module('unuApp').controller('AprobacionCursosPeriodoCtrl', ['$mdSidenav', '$q', 'MessageFactory', '$rootScope', '$scope', 'Restangular', '$mdDialog', '$timeout', 'NgTableParams', 'LxDialogService', 'ToastMD', '$mdBottomSheet', '$state',
    function($mdSidenav, $q, MessageFactory, $rootScope, $scope, Restangular, $mdDialog, $timeout, NgTableParams, LxDialogService, ToastMD, $mdBottomSheet, $state) {
      var List, service;

      $scope.UI = {
        refresh: false,
        message: MessageFactory,
        title: 'Aprobación de Cursos de Plan de Estudios',
        editMode: false,
        selected: null,
        customActions: []
      };

      var LOCAL = {
        name: 'Aprobación de Cursos de Plan de Estudios',
        form: 'views/aprobacion/cursos/form.html',
        route: 'planestudiodetalles',
        routeAprobacion:'cursoaperturadoperiodos'
      };
      service = Restangular.all(LOCAL.route);
      $rootScope.app.module = ' > ' + LOCAL.name;

      $scope.Detail = function Detail() {
        console.log('app.aprobacioncursosperiododetalle');
        $state.go('app.aprobacioncursosperiododetalle', {
          id: $scope.UI.selected._id
        });
      };

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

      $scope.filter ={
        _planestudios:{_id:0},
        _periodo:{_id:0}
      };

      $scope.ListDetallePlanEstudios = function ListDetallePlanEstudios() {
        if($scope.filter._planestudios._id===0||$scope.filter._periodo._id===0){
          return;
        }
        if($scope.tableParams){
          $scope.tableParams.reload();
        }else{
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
        }

      };

      $scope.AprobarCurso = function() {
        var service=Restangular.all(LOCAL.routeAprobacion);
        service.post({
          _periodo: $scope.filter._periodo._id,
          _planestudiodetalle:$scope.UI.selected._id
        }).then(function() {
          ToastMD.success('Se aprobó curso satisfactoriamente');
          $scope.Refresh();
        }, function(result) {
          $scope.ListDetallePlanEstudios();
        });
      };

      $scope.QuitarCurso = function() {
        var aprobacion=Restangular.one(LOCAL.routeAprobacion,$scope.UI.selected._aprobacionesPeriodo[0]._id);
        aprobacion.remove().then(function() {
          ToastMD.success('Se quito aprobación del curso satisfactoriamente');
          $scope.Refresh();
        }, function(result) {
          $scope.ListDetallePlanEstudios();
        });
      };

      $scope.Refresh = function Refresh() {
        $scope.UI.selected = null;
        $scope.UI.editMode = false;
        $scope.tableParams.reload();
      };


      $scope.EnabledEdit = function EnabledEdit(item, $groups) {
          console.log(item);
          console.log($groups);
        $scope.UI.editMode = false;
        $scope.UI.selected = null;

        angular.forEach($groups,function(group){
          angular.forEach(group.data,function(element){
            if(item._id !== element._id){
              element.active = false;
            }
          });
        });

        if (item.active) {
          $scope.UI.editMode = true;
          $scope.UI.selected = item;
          $scope.UI.selected.route = LOCAL.route;
        }
      };

      $scope.ListDetallePlanEstudios();

    }
  ]);

}).call(this);
