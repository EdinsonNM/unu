// Generated by CoffeeScript 1.9.3
(function() {
  'use strict';

  /**
    * @ngdoc function
    * @name unuApp.controller:SeccionesCtrl
    * @description
    * # SeccionesCtrl
    * Controller of the unuApp
   */

  angular.module('unuApp').controller('SeccionesCtrl', ['$q', 'MessageFactory', '$rootScope','$scope', 'Restangular', '$mdDialog', '$timeout', 'NgTableParams', 'LxDialogService', 'ToastMD',
  function($q,MessageFactory, $rootScope,$scope, Restangular, $mdDialog, $timeout, NgTableParams, LxDialogService, ToastMD) {
    var service;
    $scope.UI = {
      refresh: false,
      message: MessageFactory,
      title: 'Listado de Secciones',
      editMode: false,
      selected:null,
      customActions:[]
    };

    var LOCAL ={
      name: 'Sección',
      form:'views/secciones/form.html',
      route:'secciones',
      routeFacultades: 'facultades',
      routeEscuelas: 'escuelas'
    };
    service = Restangular.all(LOCAL.route);

    var LoadFacultades = function LoadFacultades() {
      var serviceFacultad = Restangular.all(LOCAL.routeFacultades);
      serviceFacultad.getList().then(function(data){
        $scope.facultadesFilter = data;
      });
    };
    $scope.LoadEscuelas = function LoadEscuelas(){
      var serviceEscuela = Restangular.all(LOCAL.routeEscuelas);
      serviceEscuela.getList({
        conditions: { _facultad: $scope.filter._facultadFilter._id },
        populate: '_facultadFilter'
      }).then(function(data){
        $scope.escuelasFilter = data;
      });
    };

    $rootScope.app.module = ' > ' + LOCAL.name;

    $scope.List = function() {
      $scope.tableParams = new NgTableParams({
        page: 1,
        count: 10,
        filter: {
          _escuela: $scope.filter._escuelaFilter._id
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
      $scope.tableParams.settings({counts:[]});
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
          facultades: $scope.facultadesFilter,
          selFacultad: $scope.filter ? $scope.filter._facultadFilter : null,
          selEscuela: $scope.filter ? $scope.filter._escuelaFilter : null
        },
        controller: 'SeccionNewCtrl'
      });
    };
    $scope.Edit = function Edit($event){
      var parentEl = angular.element(document.body);
      var model = Restangular.copy($scope.UI.selected);
      console.log('inicio seleccionado');
      console.log($scope.filter);
      console.log('fin seleccionado');
      $mdDialog.show({
        parent: parentEl,
        targetEvent: $event,
        templateUrl :LOCAL.form,
        locals:{
          name: LOCAL.name,
          table:$scope.tableParams,
          model: model,
          facultades: $scope.facultadesFilter
        },
        controller: 'SeccionEditCtrl'
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

    new LoadFacultades();
  }])
  .controller('SeccionNewCtrl',['$scope', 'table', 'name', 'MessageFactory', 'service', 'ToastMD', '$mdDialog', 'Restangular', 'facultades', 'selFacultad','selEscuela',
  function($scope, table, name, MessageFactory, service, ToastMD, $mdDialog, Restangular, facultades, selFacultad, selEscuela){
    $scope.includeActive = false;
    $scope.submited = false;
    $scope.title = MessageFactory.Form.New.replace('{element}',name);
    $scope.Buttons = MessageFactory.Buttons;
    $scope.message = MessageFactory.Form;
    $scope.facultades = facultades;
    $scope.model = {};

    $scope.LoadEscuelasFrm = function LoadEscuelasFrm(){
      var serviceEscuela = Restangular.all('escuelas');
      serviceEscuela.getList({ conditions:{ _facultad:$scope.model._facultad._id }, populate:'_facultad' }).then(function(data){
        $scope.escuelas = data;
      });
    };

    if (selFacultad) {
      $scope.model._facultad = selFacultad;
      $scope.LoadEscuelasFrm();
      $scope.model._escuela = selEscuela;
    }

    $scope.Save = function(form) {
      $scope.submited = true;
      if (form.$valid) {
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
  .controller('SeccionEditCtrl',['$scope', 'table', 'name', 'MessageFactory', 'model', 'ToastMD', '$mdDialog','Restangular', 'facultades',
  function($scope, table, name, MessageFactory, model, ToastMD, $mdDialog, Restangular, facultades){
    $scope.includeActive = true;
    $scope.submited = false;
    $scope.title = MessageFactory.Form.Edit.replace('{element}',name);
    $scope.Buttons = MessageFactory.Buttons;

    $scope.LoadEscuelasFrm = function LoadEscuelasFrm(){
      var serviceEscuelas = Restangular.all('escuelas');
      serviceEscuelas.getList({ conditions:{ _facultad:$scope.model._facultad._id }, populate:'_escuela' }).then(function(data){
        $scope.escuelas = data;
      });
    };
    var serviceFacultad2 = Restangular.all('facultades');
    serviceFacultad2.getList({ conditions:{ _id: model._facultad } }).then(function(data){
      model._facultad = data[0];
      $scope.LoadEscuelasFrm();
    });
    var serviceEscuela = Restangular.all('escuelas');
    serviceEscuela.getList({ conditions:{ _id: model._escuela } }).then(function(data){
      model._escuela = data[0];
    });

    $scope.model = model;
    $scope.facultades = facultades;

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
