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

  angular.module('unuApp')
    .controller('MatriculaInscripcionCtrl', function(
      MessageFactory,
      $rootScope,
      $scope,
      Restangular,
      $mdDialog,
      $timeout,
      ToastMD,
      $mdMedia,
      $state
    ) {

      /**
       * initial Params
       */
      var getFichaMatricula, getMatricula;
      $timeout(function() {
        $scope.ALUMNO = $rootScope.ALUMNO;
        $scope.ALUMNO.imagen = 'https://scontent-mia1-1.xx.fbcdn.net/hprofile-xat1/v/t1.0-1/p40x40/11223699_10153156042805197_7314257029696994522_n.jpg?oh=e7bb5941596bf09f6912f9e557017e7b&oe=5768BB8B';
        $scope.periodoIngresante = $rootScope.ALUMNO._periodoInicio;
        getFichaMatricula();
        getMatricula();
      }, 800);
      $scope.creditosactuales = 0;
      $scope.UI = {
        refresh: false,
        message: MessageFactory,
        title: '',
        editMode: false,
        selected: null,
        customActions: []
      };
      var LOCAL = {
        name: 'Matrícula',
        nameform: 'Seleccion un curso para ser agregado a su matrícula',
        form: 'views/matricula/inscripcion-form.html',
        route: 'facultades'
      };
      var serviceFichaMatricula, serviceCursoAperturadoPeriodo, fichamatricula, filter, fichamatriculaIngresante, serviceMatricula, matricula;

      var servicePeriodos = Restangular.all('periodos');
      servicePeriodos.customGET('lastPeriodo').then(function(response) {
        $scope.UI.title = response[0].nombre;
        $scope.periodo = response[0];
        $scope.periodoActual = response[0]._id;
      });
      getFichaMatricula = function() {
        /*if($scope.ALUMNO._periodoInicio === $scope.periodoActual){
          serviceCursoAperturadoPeriodo = Restangular.all('cursoaperturadoperiodos');
          filter = {
            _alumno: $scope.ALUMNO._id,
            _periodo: $scope.periodo._id,
            _escuela: $scope.ALUMNO._escuela._id
          };
          serviceCursoAperturadoPeriodo.customGET('methods/listacursosingresante', filter).then(function(response) {
            fichamatriculaIngresante = response;
          });
        }else{
          serviceFichaMatricula = Restangular.all('fichamatriculas');
          filter = {
            _alumno: $scope.ALUMNO._id,
            _periodo: $scope.periodo._id
          };
          serviceFichaMatricula.customGET('methods/fichamatriculadetalle', filter).then(function(response) {
            fichamatricula = response;
          });
        }*/

        serviceFichaMatricula = Restangular.all('fichamatriculas');
        filter = {
          _alumno: $scope.ALUMNO._id,
          _periodo: $scope.periodo._id
        };
        serviceFichaMatricula.customGET('methods/fichamatriculadetalle', filter).then(function(response) {
          fichamatricula = response;
        });
      };
      getMatricula = function(){
        serviceMatricula = Restangular.all('matriculas');
        var filter = {
          _alumno: $scope.ALUMNO._id,
          _periodo: $scope.periodo._id
        };
        serviceMatricula.customGET('lastMatricula', filter).then(function(response) {
          if(!response){
            matricula = {};
            $scope.cursosselected = [];
          }else{
            matricula = response;
            $scope.cursosselected = response._detalleMatricula;
          }
          angular.forEach(matricula._detalleMatricula, function(detalle){
            $scope.creditosactuales += detalle._grupoCurso._cursoAperturadoPeriodo._planestudiodetalle.creditos;
          });
        });
      };

      /**
       * Abre modal para agregar cursos
       */
      $scope.New = function New($event) {
        var useFullscreen = ($mdMedia('sm') || $mdMedia('xs')) && $mdMedia('xs') || $mdMedia('sm');
        var parentEl = angular.element(document.body);
        $mdDialog.show({
          parent: parentEl,
          targetEvent: $event,
          templateUrl: LOCAL.form,
          locals: {
            nameform: LOCAL.nameform,
            fichamatricula: fichamatricula,
            fichamatriculaIngresante: fichamatriculaIngresante,
            matricula: matricula
          },
          controller: 'InscripcionNewCtrl',
          fullscreen: useFullscreen
        });
      };

      $scope.NextPage = function() {
        if ($scope.periodoActual === $scope.periodoIngresante) {
          $state.go('app.matriculaingresantelast');
        } else {
          $state.go('app.matricularevisionlast');
        }
      };

      $rootScope.$on('user:inscripcioncurso', function() {
        getFichaMatricula();
        getMatricula();
      });

      $scope.FinalizarMatricula = function(){
        var serviceCompromisoPago = Restangular.all('compromisopagos');
        if(matricula && matricula._id){
          serviceCompromisoPago.customPOST({}, 'methods/generar/matricula/' + matricula._id).then(function(response){
            console.log(response);
            ToastMD.success('Se finalizó su proceso de matrícula');
            $state.go("app.matricularevisionlast");
          });
        }
      };

    })

  /**
   * controler de modal de cursos para agregar a la matrícula
   */
  .controller('InscripcionNewCtrl', function(
    $scope,
    Restangular,
    MessageFactory,
    NgTableParams,
    $timeout,
    $mdDialog,
    ToastMD,
    $rootScope,
    fichamatricula,
    fichamatriculaIngresante,
    matricula
  ) {

    var creditosaceptados;
    if(fichamatricula){
      if(!fichamatricula.creditos){
        creditosaceptados = 100;
      }else{
        creditosaceptados = fichamatricula.creditos.maximo.creditosmatricula;
      }
    }else if(fichamatriculaIngresante){
      creditosaceptados = fichamatriculaIngresante.creditos.maximo.creditosmatricula;
    }
    var creditosactuales = 0;
    angular.forEach(matricula._detalleMatricula, function(detalle){
      creditosactuales += detalle._grupoCurso._cursoAperturadoPeriodo._planestudiodetalle.creditos;
    });

    /**
     * initial params
     */
    var serviceFichaMatricula, serviceDetalleMatricula, serviceCursoAperturadoPeriodo;
    $scope.includeActive = false;
    $scope.submited = false;
    $scope.title = MessageFactory.Form.New.replace('{element}', name);
    $scope.Buttons = MessageFactory.Buttons;
    $scope.message = MessageFactory.Form;
    $scope.model = {};
    $scope.addMode = false;
    $scope.updateMode = false;
    $scope.groupsselected = [];
    var initialcount = matricula._detalleMatricula.length;

    serviceDetalleMatricula = Restangular.all('detallematriculas');
    serviceFichaMatricula = Restangular.all('fichamatriculas');
    serviceCursoAperturadoPeriodo = Restangular.all('cursoaperturadoperiodos');

    /**
     * initialize
     */
    var ListaCursosGrupos = function(){
      serviceFichaMatricula = Restangular.all('fichamatriculas');
      var filter = {};
      if(fichamatricula){
        filter = {
          _periodo: fichamatricula._periodo,
          _alumno: fichamatricula._alumno,
        };
        serviceFichaMatricula.customGET('methods/fichamatricula', filter).then(function(response) {
          var listaciclos = response.ciclos;
          angular.forEach(listaciclos, function(ciclos) {
            angular.forEach(ciclos, function(item){
              angular.forEach(item._grupos, function(grupo){
                angular.forEach(matricula._detalleMatricula, function(curso) {
                  if (grupo._id === curso._grupoCurso._id) {
                    grupo.active = true;
                  }
                });
              });
            });
          });
          $scope.cursoshabilitados = response.ciclos;
          console.log($scope.cursoshabilitados);
        });
      }else if(fichamatriculaIngresante){
        filter = {
          _periodo: fichamatriculaIngresante._periodo,
          _alumno: fichamatriculaIngresante._alumno,
          _escuela: fichamatriculaIngresante._escuela
        };
        serviceCursoAperturadoPeriodo.customGET('methods/listacursosingresante', filter).then(function(response) {
          angular.forEach(response.cursos, function(item) {
            angular.forEach(item._grupos, function(grupo){
              angular.forEach(matricula._detalleMatricula, function(curso) {
                if (grupo._id === curso._grupoCurso._id) {
                  grupo.active = true;
                }
              });
            });
          });
          $scope.cursoshabilitados = response.cursos;
        });
      }
    };
    ListaCursosGrupos();

    var findIndex = function(item) {
      var index;
      angular.forEach(matricula._detalleMatricula, function(curso, k) {
        if (item._id === curso._grupoCurso._id) {
          index = k;
        }
      });
      return index;
    };

    $scope.EnabledEdit = function(item, cursohabilitado) {
      var params = {
        _matricula: matricula._id,
        _grupoCurso: item._id,
        order: 1
      };
      var test;
      if (item.active) {
        angular.forEach(matricula._detalleMatricula, function(curso) {
          if (cursohabilitado._planestudiodetalle._curso._id === curso._grupoCurso._cursoAperturadoPeriodo._planestudiodetalle._curso._id) {
            item.active = !item.active;
            ToastMD.warning('Solo puede matricularse en un grupo por curso');
            test = true;
          }
        });
        if (!test) {
          if(creditosactuales + cursohabilitado._planestudiodetalle.creditos > creditosaceptados){
            ToastMD.warning('No puedes superar tu límite de créditos');
          }else{
            creditosactuales += cursohabilitado._planestudiodetalle.creditos;
            $scope.groupsselected.push(item);
            serviceDetalleMatricula.post(params).then(function(response) {
              matricula._detalleMatricula.push(response);
            });
          }
        }
      } else {
        var index = findIndex(item);
        angular.forEach(matricula._detalleMatricula, function(curso) {
          if (item._id === curso._grupoCurso._id) {
            serviceDetalleMatricula.one(curso._id).remove();
          }
        });
        matricula._detalleMatricula.splice(index, 1);
      }

      if ($scope.groupsselected.length !== initialcount) {
        if (initialcount === 0) {
          $scope.addMode = true;
          $scope.updateMode = false;
        } else {
          $scope.addMode = false;
          $scope.updateMode = true;
        }
      } else {
        if (initialcount !== 0) {
          $scope.addMode = false;
          $scope.updateMode = true;
        }
      }
    };

    $scope.addCursos = function() {
      ToastMD.success('Su matrícula fue actualizada');
      $rootScope.$broadcast('user:inscripcioncurso', {});
      $mdDialog.hide();
    };

    $scope.Cancel = function() {
      $mdDialog.hide();
    };

  });

}).call(this);
