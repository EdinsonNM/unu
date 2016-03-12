// Generated by CoffeeScript 1.9.3
(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name unuApp.controller:AppCtrl
   * @description
   * # AppCtrl
   * Controller of the unuApp
   */
  angular.module('unuApp')
    .controller('AppCtrl', ['DataResolve', '$scope', 'UserFactory', '$rootScope', '$mdSidenav', '$log', '$state', 'Restangular', 'TYPE_GROUP', function(DataResolve, $scope, UserFactory, $rootScope, $mdSidenav, $log, $state, Restangular, TYPE_GROUP) {
      $scope.UI = {
        access: false,
        refMatricula: '',
        refPlanestudio: '',
        hrefMatricula: '#/home',
        hrefPlanestudio: '#/home',
        messageDatos: '',
        //  refMatricula: 'app.matricularevision',
        //  hrefMatricula: '#/home/testing/matricula/revision',
        //  refPlanestudio: 'app.pabellones',
        //  hrefPlanestudio: '#/home/pabellones',
      };
      $scope.modeIngreso = true;
      $rootScope.modeIngresoGlobal = true;

      if (!DataResolve) {
        $state.go('login');
        return;
      }
      $rootScope.app.module = '';
      $rootScope.menu = UserFactory.getAccess();
      var LoadCards = function LoadCards() {
        $scope.rowsCards = [];
        var row = [];
        var rowFlex = 0;
        angular.forEach($rootScope.menu, function(item, index) {
          rowFlex += parseInt(item.flex);
          row.push(item);
          if (rowFlex === 100 || index === $rootScope.menu.length - 1) {
            $scope.rowsCards.push(angular.copy(row));
            row = [];
            rowFlex = 0;
          }
        });
        console.log($scope.rowsCards);
      };
      $scope.GoTo = function(item) {
        $rootScope.app.module = ' > ' + item.title;
        $state.go(item.url);
        return console.log(item.url);
      };
      $scope.SidenavToggle = function() {
        return $mdSidenav('left').toggle().then(function() {
          $log.debug('close sidenav');
        });
      };
      $scope.Logout = function() {
        UserFactory.logout();
      };

      var DatosAlumno = function() {
        var Service = Restangular.all('avancecurriculars');
        Service.getList({
          conditions: {
            _alumno: $rootScope.ALUMNO._id
          }
        }).then(function(data) {
          $scope.planestudio = data;
          $scope.idplanestudio = data[0]._planEstudios;
        });
      };


      var LastPeriodo = function() {
        //   var idMatriculaProceso = '56d533febc3056d0ae51276b';
        //   var idMatriculaProceso = '56c2ce17f484a8c7400909fd';
        //   var idMatriculaProceso = '56de3af7a785bf7f4d34551c';
        var f = new Date();
        var servicePeriodo = Restangular.all('periodos/lastPeriodo');
        servicePeriodo.getList().then(function(result) {
          $scope.periodoActual = result[0]._id;
          console.log('periodo actual', $scope.periodoActual);
          // $scope.nombreperiodo = result[0].nombre;
          console.log(result);
          console.log($scope.nombreperiodo);
          angular.forEach(result[0].procesos, function(item) {

            console.log(item._proceso.codigo);
            switch (item._proceso.codigo) {
              case '09':
              case '23':
                $scope.process = true;
                var fechaInicio = new Date(item.fechaInicio);
                var fechaFin = new Date(item.fechaFin);
                if (fechaInicio <= f && f <= fechaFin) {
                  $scope.showmenu = true;
                  if ($rootScope.ALUMNO.email && $rootScope.ALUMNO._persona.documento) {
                    $scope.aproved = true;
                  } else {
                    $scope.aproved = false;
                  }
                } else {
                  $scope.showmenu = false;
                  if ($rootScope.ALUMNO.email && $rootScope.ALUMNO._persona.documento) {
                    $scope.aproved = true;
                  } else {
                    $scope.aproved = false;
                    $state.go('app.alumnomisdatos');
                  }
                }
                break;
              default:
                if ($rootScope.ALUMNO.email && $rootScope.ALUMNO._persona.documento) {
                  $scope.aproved = true;
                } else {
                  $scope.aproved = false;
                  $state.go('app.alumnomisdatos');
                }
            }
            // if (item._proceso._id === idMatriculaProceso) {
            //
            // } else {
            //
            // }

          });
        });
      };

      $rootScope.ALUMNO = {};

      var LoadAlumno = function LaodAlumno() {
        console.log('load alumno..');
        var service = Restangular.all('alumnos');
        service.getList({
          conditions: {
            _usuario: $rootScope.USER._id
          },
          populate: '_persona'
        }).then(function(result) {
          console.log('load alumno..', result[0]);
          if (result.length > 0) {
            $rootScope.ShowAlert = false;
            $rootScope.ALUMNO = result[0];
            $scope.periodoIngresante = $rootScope.ALUMNO._periodoInicio;

            switch (true) {
              case $rootScope.ALUMNO.email.toString() === '':
              case $rootScope.ALUMNO._persona.documento.toString() === '':
              case $rootScope.ALUMNO.telefono.toString() === '':
              case $rootScope.ALUMNO.direccion.toString() === '':
                $scope.aproved = false;
                $scope.showmenu = false;
                break;
              default:
                $scope.aproved = true;
                $scope.showmenu = true;

            }


          }
          new LastPeriodo();
          new DatosAlumno();
        });
      };

      var Save = function() {
        //$scope.submited = true;
        //declaro el servicio con la ruta correcta del endpoint.
        $scope.model = {};
        $scope.model._periodo = $scope.periodoActual;
        $scope.model._alumno = $rootScope.ALUMNO._id;
        $scope.model._planEstudio = $scope.idplanestudio;
        $scope.model._escuela = $rootScope.ALUMNO._escuela;

        var service = Restangular.all('matriculas');
        service.post($scope.model).then(function() {
          $state.go('app.matriculainscripcion');
        });

      };
      /**Llamar al ultimo periodo****/
      $scope.LoadPage = function() {
        console.log('modalidad de ingreso' + $rootScope.ALUMNO._modalidadIngreso.codigo);
        console.log('nombre de ingreso' + $rootScope.ALUMNO._modalidadIngreso.nombre);
        $scope.nombreIngreso = $rootScope.ALUMNO._modalidadIngreso.nombre;
        $scope.modalidadIngreso = $rootScope.ALUMNO._modalidadIngreso.codigo;
        switch ($scope.modalidadIngreso) {
          case '01':
          case '02':
          case '03':
          case '16':
            $scope.modeIngreso = true;
            $rootScope.modeIngresoGlobal = true;
            console.log($scope.periodoActual);
            var serviceMatricula = Restangular.all('matriculas');
            serviceMatricula.getList({
              conditions: {
                _periodo: $scope.periodoActual,
                _alumno: $rootScope.ALUMNO._id
              }
            }).then(function(data) {
              $scope.matricula = data;
              //   $scope.matricula = data[0];
              console.log('matricula scope');
              console.log($scope.matricula);

              if ($scope.matricula) {
                angular.forEach($scope.matricula, function(item) {
                  console.log(item);
                  if (item.estado !== 'Inactivo' && item.estado !== 'Liberado') {
                    switch (item.estado) {
                      case 'Proceso':
                        console.log('Matricula en proceso');
                        $state.go('app.matriculainscripcion');
                        break;
                      case 'Prematricula':
                        console.log('Matricula en prematricula');
                        $state.go('app.matricularevisionlast');
                        break;
                      case 'Matriculado':
                        console.log('Con matricula matriculada');
                        $state.go('app.matriculaingresantelast');
                        break;
                    }
                  }
                });
                $state.go('app.matricularevision', {}, {
                  reload: true
                });
              } else {
                if ($scope.periodoIngresante === $scope.periodoActual) {
                  //Es ingresante y no hay matrocula, grabar matricula
                  new Save();
                  console.log('son iguales');
                  /**
                   * quitar comentario para testear ingresante
                   */
                  //$state.go('app.matricularevision');
                } else {
                  $state.go('app.matricularevision');
                }
              }
            });
            break;
          default:
            $scope.modeIngreso = false;
            $rootScope.modeIngresoGlobal = false;
            console.log('No puede usar el servicio por la modalidad de ingreso');
            $state.go('app.matricularevision');
        }
      };

      switch ($rootScope.USER._grupo.codigo) {
        case TYPE_GROUP.ALUMNO:
          console.log('Ingresa Alumno');
          new LoadAlumno();
          //new LastPeriodo();

          break;
        default:
          console.log('grupo no identificado');

      }

      new LoadCards();

    }]);

})();
