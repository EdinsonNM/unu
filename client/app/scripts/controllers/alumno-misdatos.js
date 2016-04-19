(function() {
  'use strict';
  angular.module('unuApp')
    .controller('AlumnoMisDatosCtrl', ['$scope',
      'Restangular',
      '$rootScope',
      '$timeout',
      'ToastMD',
      'MessageFactory',
      '$mdBottomSheet',
      '$state',
      'ALUMNO',
      function($scope, Restangular, $rootScope, $timeout, ToastMD, MessageFactory, $mdBottomSheet, $state, ALUMNO) {

        var LOCAL = {
          routeAlumno: 'alumnos',
          routePersona: 'personas'
        };
        $scope.editable = false;
        $scope.Buttons = MessageFactory.Buttons;
        $scope.UI = {
          message: MessageFactory,
          title: 'Actualización de Mis Datos',
          editMode: false
        };
        $scope.message = MessageFactory.Form;

        $scope.model = Restangular.copy(ALUMNO);
        $scope.model.apellidos = $scope.model._persona.apellidoPaterno + ' ' + $scope.model._persona.apellidoMaterno;
        if($scope.model._persona.fechaNacimiento ){
          $scope.model._persona.fechaNacimiento = new Date($scope.model._persona.fechaNacimiento);
        }

        var serviceAlumno = Restangular.all(LOCAL.routeAlumno);
        var servicePersona = Restangular.all(LOCAL.routePersona);

        servicePersona.customGET('model/sexo', {}).then(function(result) {
          $scope.sexo = result; //sexo = result;
        });
        serviceAlumno.customGET('model/estadoCivil', {}).then(function(result) {
          $scope.estadoscivil = result; //sexo = result;
        });
        $scope.Edit = function Edit($event) {
          $scope.UI.editMode = true;
          $scope.editable = true;
          ToastMD.success(MessageFactory.Form.AllowEdit);
          console.log('edit');
        };
        $scope.submited = false;
        $scope.Save = function Save($event,form) {
          $scope.submited = true;
          if(form.$valid){
            $scope.model.route = 'alumnos';
            $scope.UI.editMode = false;
            $scope.model.email = $scope.model.email||'';
            $scope.model._persona.documento = $scope.model._persona.documento||'';
            $scope.model.telefono = $scope.model.telefono||'';
            $scope.model.direccion = $scope.model.direccion||'';
            $scope.model.put().then(function(result) {
              $scope.editable = false;
              ToastMD.success(MessageFactory.Form.Updated);
              console.log(result);
              $state.go('app', {}, {reload:true});
            });
          }else{
            ToastMD.warning('Es necesario que actualice toda su información');
          }

        };

      }
    ]);
}).call(this);
