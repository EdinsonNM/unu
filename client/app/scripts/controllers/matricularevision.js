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
// predef _:true,moment:true
  angular.module('unuApp').controller('MatriculaRevisionCtrl', [
    'ALUMNO','PERIODO','PROCESO_MATRICULA','MessageFactory', '$rootScope', '$scope', 'Restangular', '$mdDialog', '$timeout', 'NgTableParams', 'LxDialogService', 'ToastMD', '$mdBottomSheet', '$state',
    function(ALUMNO,PERIODO,PROCESO_MATRICULA,MessageFactory, $rootScope, $scope, Restangular, $mdDialog, $timeout, NgTableParams, LxDialogService, ToastMD, $mdBottomSheet, $state) {
      console.log("ALUMNO=========",ALUMNO,'=============');
      console.log("PERIODO ACTIVO:",PERIODO);
      var service, servicePendientes, serviceDeudas;

      $scope.UI = {
        refresh: false,
        message: MessageFactory,
        //title: 'Matrícula 2016 - I',
        editMode: false,
        selected: null,
        messagePendiente: 'No se encontro ningun pendiente',
        messageDeudas: 'No se encontro ninguna deuda pendiente',
        messageAction: 'Iniciar el proceso de matricula',
        requisitos:{
          modalidad:false,
          conflictos:false,
          deudas:false,
          fechaMatriculaRegular:false,
          tipoAlumno:false,
          tipoCondicionAlumno:false,
          situacionAlumno:false,
          tipoSituacionAlumno:false
        },
        mostrarUI:false
      };

      $scope.modeIngreso = false;

      var LOCAL = {
        name: 'Registrar Matricula',

      };

      servicePendientes = Restangular.all('conflictosalumnos');
      serviceDeudas = Restangular.all('compromisopagos');



      var ListPendientesAlumno = function() {
        if(!$scope.tableParamsPendientes){
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
                  if (result.data.length === 0) {
                    $scope.UI.requisitos.conflictos = true;
                  }
                }, 500);
              });
            }
          });
        }else{
          $scope.tableParamsPendientes.reload();
        }
      };

      var ListDeudasAlumno = function() {
        if(!$scope.tableParamsDeudas){
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
                  if (result.data.length === 0) {
                    $scope.UI.requisitos.deudas = true;
                  }
                }, 500);
              });
            }
          });
        }else{
          $scope.tableParamsDeudas.reload();
        }


      };

      var verificaMatricula = function() {
        var nombreModalidadIngreso;
        var modalidadIngreso;
        if(ALUMNO._modalidadIngreso.hasOwnProperty('nombre')){
          nombreModalidadIngreso = ALUMNO._modalidadIngreso.nombre;
          modalidadIngreso = ALUMNO._modalidadIngreso.codigo;
        }else{
          nombreModalidadIngreso = 'Sin Modalidad';
          modalidadIngreso = '99';
        }

        switch (modalidadIngreso) {
          case '01':
          case '02':
          case '03':
          case '16':
            $scope.UI.requisitos.modalidad = true;
            break;
          default:
            $scope.UI.requisitos.modalidad = false;
            $scope.messageModalidad = 'Estamos mejorando dia a dia pero por el momento no podemos atender la modalidad : ' + nombreModalidadIngreso;
        }
      };

      var verificaTipoAlumnoNormal = function(){
        $scope.UI.requisitos.tipoAlumno = false;
        if(!_.isEmpty(ALUMNO._tipoAlumno)){
          if(ALUMNO._tipoAlumno.codigo==='02'){
            $scope.UI.requisitos.tipoAlumno = true;
          }
        }
      };

      var verificaTipoCondicionAlumnoNormal = function(){
        $scope.UI.requisitos.tipoCondicionAlumno = false;
        if(!_.isEmpty(ALUMNO._tipoCondicionAlumno)){
          if(ALUMNO._tipoCondicionAlumno.codigo==='01'){
            $scope.UI.requisitos.tipoCondicionAlumno = true;
          }
        }
      };

      var verificaSituacionAlumnoActivo = function(){
        $scope.UI.requisitos.situacionAlumno = false;
        if(!_.isEmpty(ALUMNO._situacionAlumno)){
          if(ALUMNO._situacionAlumno.codigo==='01'){
            $scope.UI.requisitos.situacionAlumno = true;
          }
        }
      };

      var verificaTipoSituacionAlumnoNoMatriculado = function(){
        $scope.UI.requisitos.tipoSituacionAlumno = false;
        if(!_.isEmpty(ALUMNO._tipoSituacionAlumno)){
          if(ALUMNO._tipoSituacionAlumno.codigo==='02'){
            $scope.UI.requisitos.tipoSituacionAlumno = true;
          }
        }
      };


      var verificaTipo

      var validaProcesoRegularActivo = function validaProceso(){
        var service = Restangular.all('procesofacultades');
        service.getList({
          populate:'_proceso',
          conditions:{
            _periodo:PERIODO._id,
            _facultad:ALUMNO._escuela._facultad._id
          }}).then(function(data){
          var regular  = _.find(data,function(item){
            return item._proceso.codigo ===PROCESO_MATRICULA.REGULAR;
          });
          debugger;
          if(!regular) {
            $scope.UI.requisitos.fechaMatriculaRegular = false;
            $scope.UI.messageFechaRegular ='No se han definido las fechas para el inicio del proceso mátricula';
          }else{
            var today = new Date();
            switch (true) {
            case moment(today).isAfter(new Date(regular.fechaInicio)):
            case moment(today).isBefore(new Date(regular.fechaFin)):
              $scope.UI.requisitos.fechaMatriculaRegular = true;
              break;
            default:
              $scope.UI.requisitos.fechaMatriculaRegular = false;
              if(moment(today).isBefore(new Date(regular.fechaInicio)))
                $scope.UI.messageFechaRegular ='Proceso de Matricula aun no se ha iniciado para su facultad';
              if(moment(today).isAfter(new Date(regular.fechaFin)))
                $scope.UI.messageFechaRegular ='Proceso de Matricula ya ha terminado';

            }
          }

        });
      };




      var ValidadAccesoUI = function(){
        console.log($state.$current.name);
        var serviceMatricula = Restangular.all('matriculas');
        serviceMatricula.getList({
          conditions: {
            _periodo: PERIODO._id,
            _alumno: $scope.ALUMNO._id
          }
        }).then(function(data) {
          if(data.length>0){
            console.log($scope.matricula);
            $scope.matricula = data[0];
            $scope.RedirectWithMatricula($scope.matricula);
          }else{
            $scope.UI.mostrarUI = true;
          }
        });
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
      $scope.ALUMNO = ALUMNO;
      $scope.ALUMNO.imagen = 'https://scontent-mia1-1.xx.fbcdn.net/hprofile-xat1/v/t1.0-1/p40x40/11223699_10153156042805197_7314257029696994522_n.jpg?oh=e7bb5941596bf09f6912f9e557017e7b&oe=5768BB8B';
      ListPendientesAlumno();
      ListDeudasAlumno();
      datosAlumno();
      verificaMatricula();
      validaProcesoRegularActivo();
      ValidadAccesoUI();
      verificaSituacionAlumnoActivo();
      verificaTipoAlumnoNormal();
      verificaTipoCondicionAlumnoNormal();
      verificaTipoSituacionAlumnoNoMatriculado();

      $scope.Save = function() {
        //$scope.submited = true;
        //declaro el servicio con la ruta correcta del endpoint.
        $scope.model = {};
        $scope.model._periodo = PERIODO._id;
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
