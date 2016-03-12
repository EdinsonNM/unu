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

  angular.module('unuApp').controller('MatriculaRevisionCtrl', [
    'MessageFactory', '$rootScope', '$scope', 'Restangular', '$mdDialog', '$timeout', 'NgTableParams', 'LxDialogService', 'ToastMD', '$mdBottomSheet', '$state',
    function(MessageFactory, $rootScope, $scope, Restangular, $mdDialog, $timeout, NgTableParams, LxDialogService, ToastMD, $mdBottomSheet, $state) {
      var service, servicePendientes, serviceDeudas;

      console.log('Mostrar' + $rootScope.ALUMNO.codigo);



      $scope.UI = {
        refresh: false,
        message: MessageFactory,
        //title: 'Matrícula 2016 - I',
        editMode: false,
        selected: null,
        messagePendiente: 'No se encontro ningun pendiente',
        messageDeudas: 'No se encontro ninguna deuda pendiente',
        messageAction: 'Iniciar el proceso de matricula',
        deudasValue: false,
        pendientesValue: false,
        nextStage1: false,
        nextStage2: false
      };

      $scope.modeIngreso = false;

      var LOCAL = {
        name: 'Registrar Matricula',
        //form: 'views/aprobacion/cursos/form-grupo.html',
        //route: 'matriculas',

      };

      //service = Restangular.all(LOCAL.route);
      servicePendientes = Restangular.all('conflictosalumnos');
      serviceDeudas = Restangular.all('compromisopagos');

      var ListPendientesAlumno = function() {
        //   if(id_alumno === 0){
        //      return;
        //   }
        $scope.tableParamsPendientes = new NgTableParams({
          page: 1,
          count: 1000,
          filter: {
            _alumno: $scope.ALUMNO._id,
            estado: 'Pendiente'
          }
        }, {
          total: 0,
          counts: [],
          getData: function($defer, params) {
            var query;
            query = params.url();

            servicePendientes.customGET('methods/conflicto', query).then(function(result) {
              $timeout(function() {
                params.total(result.total);
                $defer.resolve(result.data);
                if (result.data.length !== 0) {
                  $scope.UI.pendientesValue = true;
                  $scope.UI.nextStage1 = false;
                } else {

                  $scope.UI.nextStage1 = true;
                  $scope.UI.messagePendiente = 'No se encontro ningun pendiente';

                }
              }, 500);
            });
          }
        });
      };

      var ListDeudasAlumno = function() {
        console.log('Codigo de alumno:' + $rootScope.ALUMNO.codigo);
        $scope.tableParamsDeudas = new NgTableParams({
          page: 1,
          count: 1000,
          filter: {
            codigo: $scope.ALUMNO.codigo,
            pagado: false

          }
        }, {
          total: 0,
          counts: [],
          getData: function($defer, params) {
            var query;
            query = params.url();
            serviceDeudas.customGET('methods/deudas', query).then(function(result) {
              $timeout(function() {
                params.total(result.total);
                $defer.resolve(result.data);
                console.log(result.data);
                if (result.data.length !== 0) {
                  $scope.UI.deudasValue = true;
                  $scope.UI.nextStage2 = false;
                } else {
                  $scope.UI.nextStage2 = true;
                  $scope.UI.deudasValue = false;
                  $scope.UI.messageDeudas = 'No se encontro ninguna deuda pendiente';

                }
              }, 500);
            });
          }
        });

      };

      var verificaMatricula = function() {
        $scope.nombreIngreso = $rootScope.ALUMNO._modalidadIngreso.nombre;
        $scope.modalidadIngreso = $rootScope.ALUMNO._modalidadIngreso.codigo;
        console.log('modadlida', $scope.modalidadIngreso);
        switch ($scope.modalidadIngreso) {
          case '04':
          case '06':
          case '07':
          case '08':
          case '09':
          case '10':
          case '11':
          case '12':
          case '13':
          case '14':
          case '15':
          case '17':
          case '18':
            $scope.modeIngreso = true;
            var serviceMatricula = Restangular.all('matriculas');
            serviceMatricula.getList({
              conditions: {
                _periodo: $scope.idLast,
                _alumno: $scope.ALUMNO._id
              }
            }).then(function(data) {
              $scope.matricula = data[0];
              console.log('matricula scope');
              console.log($scope.matricula);
              // if($scope.matricula.length !== 0){}
              if ($scope.matricula) {
                if ($scope.matricula.estado === 'Proceso') {
                  $state.go('app.matriculainscripcion');
                } else {
                  if ($scope.matricula.estado === 'Prematricula') {
                    $state.go('app.matricularevisionlast');
                  }
                }
              }
            });
            break;
          default:
            $scope.modeIngreso = false;
            $scope.UI.nextStage1 = false;
            $scope.UI.nextStage2 = false;
            $scope.modeIngresoGlobal = false;
            $scope.messageModalidad = 'por su modalidad de ingreso: ' + $scope.nombreIngreso;
        }
      };



      var datosAlumno = function() {
        //$scope.idplanestudio= 'null';
        var Service = Restangular.all('avancecurriculars');
        //  console.log('alumno_id datosalummno'+$scope.ALUMNO._id);
        Service.getList({
          conditions: {
            _alumno: $scope.ALUMNO._id
          }
        }).then(function(data) {
          $scope.planestudio = data;
          $scope.idplanestudio = data[0]._planEstudios;
        });
      };

      $timeout(function() {
        console.log('root' + $rootScope.ALUMNO.codigo);
        $scope.ALUMNO = $rootScope.ALUMNO;
        console.log($rootScope.ALUMNO);
        console.log('periodo' + $rootScope.ALUMNO.periodo);
        $scope.ALUMNO.imagen = 'https://scontent-mia1-1.xx.fbcdn.net/hprofile-xat1/v/t1.0-1/p40x40/11223699_10153156042805197_7314257029696994522_n.jpg?oh=e7bb5941596bf09f6912f9e557017e7b&oe=5768BB8B';
        ListPendientesAlumno();
        ListDeudasAlumno();
        datosAlumno();
        verificaMatricula();
      }, 500);

      var ultimoPeriodo = function ultimoPeriodo() {
        var servicePeriodo = Restangular.all('periodos/lastPeriodo');
        servicePeriodo.getList().then(function(data) {
          $scope.periodo = data;
          $scope.idLast = data[0]._id;
          $scope.periodoNombre = data[0].nombre;
        });
      };

      ultimoPeriodo();

      $scope.Save = function() {
        //$scope.submited = true;
        //declaro el servicio con la ruta correcta del endpoint.
        $scope.model = {};
        $scope.model._periodo = $scope.idLast;
        $scope.model._alumno = $scope.ALUMNO._id;
        $scope.model._planEstudio = $scope.idplanestudio;
        $scope.model._escuela = $scope.ALUMNO._escuela;

        console.log($scope.model);
        service = Restangular.all('matriculas');
        service.post($scope.model).then(function() {
          ToastMD.info(MessageFactory.Form.Saved);
          // $mdDialog.hide();
        }, function(error) {
          switch (error.status) {
            case 422:
              $scope.ValidationError = error.data;
              break;
            default:
          }

        }, function(result) {
          ToastMD.error(result.data.message);


        });

      };

    }
  ]);

}).call(this);
