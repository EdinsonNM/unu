// Generated by CoffeeScript 1.9.3
(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name unuApp.controller:PlanestudiosCtrl
   * @description
   * # PlanestudiosCtrl
   * Controller of the unuApp
   */

  angular.module('unuApp').controller('EscuelaParametrosProcesosCtrl', [
    '$mdSidenav', '$q', 'MessageFactory', '$rootScope', '$scope', 'Restangular', '$mdDialog', '$timeout', 'NgTableParams', 'LxDialogService', 'ToastMD', '$mdBottomSheet', '$state',
    function($mdSidenav, $q, MessageFactory, $rootScope, $scope, Restangular, $mdDialog, $timeout, NgTableParams, LxDialogService, ToastMD, $mdBottomSheet, $state) {
      var List, serviceProcesoEscuela, serviceParametroEscuela;

      $scope.UI = {
        refresh: false,
        message: MessageFactory,
        title: 'Registro de Parametros y Procesos por Escuela',
        editMode: false,
        selected: null,
        customActions: []
      };

      var LOCAL = {
        name: 'Parametros y Procesos por Escuela',
        form: 'views/escuelas/params-procesos-form.html',
        routeParametros: 'parametroescuelas',
        routeProcesos: 'procesosescuelas'
      };

      serviceProcesoEscuela = Restangular.all(LOCAL.routeProcesos);
      $rootScope.app.module = ' > ' + LOCAL.name;

      var LoadFacultades = function LoadFacultades() {
        var serviceFacultad = Restangular.all('facultades');
        serviceFacultad.getList().then(function(data) {
          $scope.facultades = data;
        });
      };
      $scope.LoadEcuelas = function LoadEcuelas() {
        var serviceEscuela = Restangular.all('escuelas');
        serviceEscuela.getList({
          conditions: {
            _facultad: $scope.filter._facultad._id
          },
          populate: '_facultad'
        }).then(function(data) {
          $scope.escuelas = data;
        });
      };
      $scope.LoadProcesosEscuela = function LoadProcesosEscuela() {
        var serviceProcesoEscuela = Restangular.all('procesos');
        serviceProcesoEscuela.getList({
          conditions: {
            _escuela: $scope.filter._escuela._id,
            _periodo: $scope.filter._periodo._id
          }
        }).then(function(data) {
          $scope.procesosEscuela = data;
        });
      };

      var LoadPeriodos = function LoadPeriodos() {
        var servicePeriodo = Restangular.all('periodos');
        servicePeriodo.getList().then(function(data) {
          $scope.periodos = data;
        });
      };
      new LoadPeriodos();
      new LoadFacultades();

      List = function() {
        $scope.tableParams = new NgTableParams({
          page: 1,
          count: 10,
          filter: {
            _escuela: 0
          }
        }, {
          total: 0,
          getData: function($defer, params) {
            var query;
            query = params.url();
            $scope.UI.refresh = true;
            service.customGET('methods/paginate', query).then(function(result) {
              $timeout(function() {
                params.total(result.total);
                $defer.resolve(result.data);
                $scope.UI.refresh = false;
              }, 500);
            });
          }
        });
        $scope.tableParams.settings({
          counts: []
        });
      };

      $scope.Refresh = function Refresh() {
        $scope.UI.selected = null;
        $scope.UI.editMode = false;
        $scope.tableParams.reload();
      };

      $scope.filter = {};
      $scope.New = function New($event) {
          console.log($scope.selectedTab);
        if (!$scope.filter._escuela) {
          ToastMD.warning('Debe seleccionar una escuela antes de agregar un parametro');
          return;
        }

        if (!$scope.filter._periodo) {
          ToastMD.warning('Debe seleccionar un periodo antes de crear un parametro');
          return;
        }



        var parentEl = angular.element(document.body);
        $mdDialog.show({
          parent: parentEl,
          targetEvent: $event,
          templateUrl: LOCAL.form,
          locals: {
            name: LOCAL.name,
            table: $scope.tableParams,
            escuela: $scope.filter._escuela,
            periodo: $scope.filter._periodo,
            serviceProcesoEscuela: serviceProcesoEscuela
          },
          controller: 'EscuelaParametrosProcesosNewCtrl'
        });
      };
      $scope.Edit = function Edit($event) {
        var parentEl = angular.element(document.body);
        $mdDialog.show({
          parent: parentEl,
          targetEvent: $event,
          templateUrl: LOCAL.form,
          locals: {
            name: LOCAL.name,
            table: $scope.tableParams,
            model: Restangular.copy($scope.UI.selected),
            escuela: $scope.filter._escuela
          },
          controller: 'EscuelaParametrosProcesosEditCtrl'
        });
      };

      $scope.Delete = function Delete($event) {
        var confirm = $mdDialog.confirm()
          .title(LOCAL.name)
          .content(MessageFactory.Form.QuestionDelete)
          .ariaLabel(LOCAL.name)
          .targetEvent($event)
          .ok(MessageFactory.Buttons.Yes)
          .cancel(MessageFactory.Buttons.No);

        var selected = Restangular.copy($scope.UI.selected);

        $mdDialog.show(confirm).then(function() {
          selected.remove().then(function() {
            $scope.Refresh();
            ToastMD.info(MessageFactory.Form.Deleted);
          });
        }, function() {

        });
      };

      $scope.EnabledEdit = function EnabledEdit(item) {
        $scope.UI.editMode = false;
        $scope.UI.selected = null;
        angular.forEach($scope.tableParams.data, function(element) {
          if (item._id !== element._id) {
            element.active = false;
          }
        });

        if (item.active) {
          $scope.UI.editMode = true;
          $scope.UI.selected = item;
          $scope.UI.selected.route = LOCAL.route;
        }
      };

      //new List();
    }
  ])

  .controller('EscuelaParametrosProcesosNewCtrl', [
      '$scope', 'name', 'table', 'escuela', 'periodo', 'MessageFactory', 'serviceProcesoEscuela', 'Restangular', 'ToastMD', '$mdDialog',
      function($scope, name, table, escuela, periodo, MessageFactory, serviceProcesoEscuela, Restangular, ToastMD, $mdDialog) {
        console.log(escuela);
        console.log(periodo);
        $scope._escuela = escuela;
        $scope._periodo = periodo;
        $scope.submited = false;
        $scope.title = MessageFactory.Form.New.replace('{element}', name);
        $scope.Buttons = MessageFactory.Buttons;
        $scope.message = MessageFactory.Form;

        Restangular.all('procesos').getList().then(function(data) {
          $scope.procesos = data;
        });
        $scope.model = {
          _escuela: escuela._id,
          _periodo: periodo._id
        };
        $scope.Save = function(form) {
          $scope.submited = true;
          if (form.$valid) {
            serviceProcesoEscuela.post($scope.model).then(function() {
              ToastMD.info(MessageFactory.Form.Saved);
              $mdDialog.hide();
              table.reload();
            });
          }
        };
        $scope.Cancel = function() {
          $mdDialog.hide();
        };
      }
    ])
    .controller('EscuelaParametrosProcesosEditCtrl', ['$scope', 'table', 'name', 'model', 'escuela', 'MessageFactory', 'Restangular', 'ToastMD', '$mdDialog',
      function($scope, table, name, model, escuela, MessageFactory, Restangular, ToastMD, $mdDialog) {
        $scope.escuela = escuela;
        $scope.submited = false;
        $scope.model = model;
        $scope.model.fecha_resolucion = new Date($scope.model.fecha_resolucion);
        $scope.title = MessageFactory.Form.Edit.replace('{element}', name);
        $scope.Buttons = MessageFactory.Buttons;
        Restangular.all('periodos').getList().then(function(data) {
          $scope.periodos = data;
        });
        $scope.Save = function(form) {
          $scope.submited = true;
          if (form.$valid) {
            $scope.model.put().then(function() {
              ToastMD.info(MessageFactory.Form.Updated);
              $mdDialog.hide();
              table.reload();
            });
          }
        };
        $scope.Cancel = function() {
          $mdDialog.hide();
        };
      }
    ]);

}).call(this);
