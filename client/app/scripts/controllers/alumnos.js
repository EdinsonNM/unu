// Generated by CoffeeScript 1.9.3
(function() {
  'use strict';

  /**
    * @ngdoc function
    * @name unuApp.controller:AlumnosCtrl
    * @description
    * # AlumnosCtrl
    * Controller of the unuApp
   */

  angular.module('unuApp').controller('AlumnosCtrl', [ 'MessageFactory', '$rootScope','$scope', 'Restangular', '$mdDialog', '$timeout', 'NgTableParams', 'LxDialogService', 'ToastMD',
  function(MessageFactory, $rootScope,$scope, Restangular, $mdDialog, $timeout, NgTableParams, LxDialogService, ToastMD) {
    var List, service, service_usuario;
    $scope.UI = {
      refresh: false,
      message: MessageFactory,
      title: 'Listado de Alumnos',
      editMode: false,
      selected:null,
      customActions:[]
    };

    var LOCAL ={
      name: 'Alumno',
      form:'views/alumnos/form.html',
      route:'alumnos',
      route_usuarios:'usuarios',
      route_periodos: 'periodos',
      route_facultades: 'facultades',
      route_escuelas: 'escuelas',
      route_situacionalumnos: 'situacionalumnos',
      route_tipocondicionalumnos: 'tipocondicionalumnos',
      route_modalidadingresos: 'modalidadingresos',
    };
    service = Restangular.all(LOCAL.route);
    service_usuario = Restangular.all(LOCAL.route_usuarios);

    //var sexo = [];
    service.customGET('model/sexo', {}).then(function(result){
      $scope.sexo = result; //sexo = result;
    });
    service.customGET('model/estadoCivil', {}).then(function(result){
      $scope.estadoCivil = result;
    });

    var LoadPeriodos = function LoadPeriodos() {
      var servicePeriodo = Restangular.all(LOCAL.route_periodos);
      servicePeriodo.getList().then(function(data){
        $scope.periodos = data;
      });
    };
    var LoadFacultades = function LoadFacultades() {
      var serviceFacultad = Restangular.all(LOCAL.route_facultades);
      serviceFacultad.getList().then(function(data){
        $scope.facultades = data;
      });
    };
    var LoadSituacionAlumnos = function LoadSituacionAlumnos() {
      var serviceSituaciones = Restangular.all(LOCAL.route_situacionalumnos);
      serviceSituaciones.getList().then(function(data){
        $scope.situaciones = data;
      });
    };
    var LoadTipoCondicionAlumnos = function LoadTipoCondicionAlumnos() {
      var serviceCondiciones = Restangular.all(LOCAL.route_tipocondicionalumnos);
      serviceCondiciones.getList().then(function(data){
        $scope.condiciones = data;
      });
    };
    var LoadModalidadIngresos = function LoadModalidadIngresos() {
      var serviceModalidades = Restangular.all(LOCAL.route_modalidadingresos);
      serviceModalidades.getList().then(function(data){
        $scope.modalidades = data;
      });
    };

    $rootScope.app.module = ' > ' + LOCAL.name;

    List = function() {
      $scope.tableParams = new NgTableParams({
        page: 1,
        count: 10
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
    };

    $scope.Refresh = function Refresh(){
      $scope.UI.selected = null;
      $scope.UI.editMode = false;
      $scope.tableParams.reload();
    };

    $scope.New = function New($event){
      var parentEl = angular.element(document.body);
      $mdDialog.show({
        parent: parentEl,
        targetEvent: $event,
        templateUrl :LOCAL.form,
        locals:{
          name: LOCAL.name,
          table:$scope.tableParams,
          service:service,
          sexo: $scope.sexo,
          estadoCivil: $scope.estadoCivil,
          periodos: $scope.periodos,
          facultades : $scope.facultades,
          situaciones : $scope.situaciones,
          condiciones : $scope.condiciones,
          modalidades : $scope.modalidades,
          route_escuelas: LOCAL.route_escuelas
        },
        controller: 'AlumnoNewCtrl'
      });
    };
    $scope.Edit = function Edit($event){
      var parentEl = angular.element(document.body);
      var model = Restangular.copy($scope.UI.selected);
      //console.log(model);
      $mdDialog.show({
        parent: parentEl,
        targetEvent: $event,
        templateUrl :LOCAL.form,
        locals:{
          name: LOCAL.name,
          table:$scope.tableParams,
          model: model,
          sexo: $scope.sexo,
          estadoCivil: $scope.estadoCivil,
          periodos: $scope.periodos,
          facultades : $scope.facultades,
          situaciones : $scope.situaciones,
          condiciones : $scope.condiciones,
          modalidades : $scope.modalidades,
          route_escuelas: LOCAL.route_escuelas
        },
        controller: 'AlumnoEditCtrl'
      });
    };
    $scope.Delete = function Delete($event){
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
          ToastMD.success(MessageFactory.Form.Deleted);
          //NOTE: Pendiente eliminar el USUARIO.
        });
      }, function() {

      });
    };

    $scope.EnabledEdit =function EnabledEdit(item){
      $scope.UI.editMode = false;
      $scope.UI.selected = null;
      angular.forEach($scope.tableParams.data,function(element){
        if(item._id !== element._id){
          element.active = false;
        }
      });

      if( item.active ){
        $scope.UI.editMode = true;
        $scope.UI.selected = item;
        $scope.UI.selected.route = LOCAL.route;
      }
    };

    new List();
    new LoadPeriodos();
    new LoadFacultades();
    new LoadSituacionAlumnos();
    new LoadTipoCondicionAlumnos();
    new LoadModalidadIngresos();
  }])
  .controller('AlumnoNewCtrl',['$scope', 'table', 'name', 'MessageFactory', 'service', 'sexo', 'estadoCivil', 'periodos','facultades', 'situaciones','condiciones','modalidades','route_escuelas', 'ToastMD', '$mdDialog', 'Restangular',
  function($scope, table, name, MessageFactory, service, sexo, estadoCivil, periodos, facultades, situaciones, condiciones, modalidades, route_escuelas, ToastMD, $mdDialog, Restangular){
    $scope.includeUserData = true;
    $scope.submited = false;
    $scope.title = MessageFactory.Form.New.replace('{element}',name);
    $scope.Buttons = MessageFactory.Buttons;
    $scope.message = MessageFactory.Form;
    $scope.sexo = sexo;
    $scope.estadoCivil = estadoCivil;
    $scope.periodos = periodos;
    $scope.facultades = facultades;
    $scope.situaciones = situaciones;
    $scope.condiciones = condiciones;
    $scope.modalidades = modalidades;
    $scope.model = {};
    $scope.model._usuario = {username: '', password: '', email: ''};
    $scope.LoadEscuelas = function LoadEscuelas(){
      var serviceEscuela = Restangular.all(route_escuelas);
      serviceEscuela.getList({conditions:{_facultad:$scope.model._facultad._id}, populate:'_facultad'}).then(function(data){
        $scope.escuelas = data;
      });
    };
    $scope.Save = function(form) {
      $scope.submited = true;
      if (form.$valid) {
        $scope.model._usuario.email = $scope.model.email;

        console.log('alumno.js');
        console.log($scope.model);
        service.post($scope.model).then(function() {
          ToastMD.success(MessageFactory.Form.Saved);
          $mdDialog.hide();
          table.reload();
        });
      }
    };
    $scope.Cancel = function(){
      $mdDialog.hide();
    };
  }])
  .controller('AlumnoEditCtrl',['$scope', 'table', 'name', 'MessageFactory', 'model', 'sexo', 'estadoCivil','periodos','facultades', 'situaciones','condiciones','modalidades','route_escuelas', 'ToastMD', '$mdDialog', 'Restangular',
  function($scope, table, name, MessageFactory, model, sexo, estadoCivil, periodos, facultades, situaciones, condiciones, modalidades, route_escuelas, ToastMD, $mdDialog, Restangular){
    $scope.includeUserData = false;
    $scope.submited = false;

    $scope.LoadEscuelas = function LoadEscuelas(){
      var serviceEscuela = Restangular.all(route_escuelas);
      serviceEscuela.getList({conditions:{_facultad:$scope.model._facultad._id}, populate:'_facultad'}).then(function(data){
        $scope.escuelas = data;
      });
    };
    var serviceFacultad = Restangular.all('facultades');
    serviceFacultad.getList({conditions:{_id:model._escuela._facultad}}).then(function(data){
      model._facultad = data[0];
      $scope.LoadEscuelas();
    });
    $scope.model = model;
    $scope.title = MessageFactory.Form.Edit.replace('{element}',name);
    $scope.Buttons = MessageFactory.Buttons;
    $scope.sexo = sexo;
    $scope.estadoCivil = estadoCivil;
    $scope.model.fechaNacimiento = new Date($scope.model.fechaNacimiento);
    $scope.periodos = periodos;
    $scope.facultades = facultades;
    $scope.situaciones = situaciones;
    $scope.condiciones = condiciones;
    $scope.modalidades = modalidades;

    $scope.Save = function(form) {
      $scope.submited = true;
      if (form.$valid) {
        $scope.model.put().then(function() {
          ToastMD.success(MessageFactory.Form.Updated);
          $mdDialog.hide();
          table.reload();
        });
      }
    };
    $scope.Cancel = function(){
      $mdDialog.hide();
    };
  }]);

}).call(this);
