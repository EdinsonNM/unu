// Generated by CoffeeScript 1.9.3
(function() {
  'use strict';

  /**
    * @ngdoc function
    * @name unuApp.controller:ConflictoCtrl
    * @description
    * # ConflictoCtrl
    * Controller of the unuApp
   */

  angular.module('unuApp').controller('ConflictosalumnoCtrl', [
'MessageFactory', '$rootScope', '$scope', 'Restangular', '$mdDialog', '$timeout', 'ngTableParams', 'LxDialogService', 'ToastMD', '$mdBottomSheet', '$state',
  function(MessageFactory, $rootScope, $scope, Restangular, $mdDialog, $timeout, ngTableParams, LxDialogService, ToastMD, $mdBottomSheet, $state) {
    var List, service;

    $scope.estadosFilter = [];
    $scope.UI = {
      refresh: false,
      message: MessageFactory,
      title: 'Conflictos de Alumnos',
      editMode: false,
      selected: null,
      customActions:[]
    };
    var LOCAL ={
      name: 'Conflictos de alumnos',
      form:'views/conflictosalumnos/form.html',
      route:'conflictosalumnos',
      route_conflictos:'conflictos',
      route_facultades: 'facultades',
      route_periodos: 'periodos',
      route_escuelas: 'escuelas'
    };
    service = Restangular.all(LOCAL.route);
    $rootScope.app.module = ' > ' + LOCAL.name;

    service.customGET('model/estado', {}).then(function(result){
        $scope.estados = result;
        angular.forEach(data, function(item) {
        $scope.estadosFilter.push({
            'id': item,
            'title': item
            });
        });
    });

    var LoadConflictos = function LoadConflictos() {
      var serviceConflicto = Restangular.all(LOCAL.route_conflictos);
      serviceConflicto.getList().then(function(data){
        $scope.conclictos = data;
      });
    };


    List = function() {
      $scope.tableParams = new ngTableParams({
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
        templateUrl: LOCAL.form,
        locals:{
          service: service,
          name: LOCAL.name,
          table:$scope.tableParams,
          estados: $scope.estados,
          conflictos: $scope.conclictos
        },
        controller: 'ConflictosalumnoNewCtrl'
      });
    };
    $scope.Edit = function Edit($event){
      var parentEl = angular.element(document.body);
      var model = Restangular.copy($scope.UI.selected);
      console.log(model);
      $mdDialog.show({
        parent: parentEl,
        targetEvent: $event,
        templateUrl: LOCAL.form,
        locals:{
          name: LOCAL.name,
          table:$scope.tableParams,
          model: model,
          estados: $scope.estados,
          conflictos: $scope.conclictos
        },
        controller: 'ConflictosalumnoEditCtrl'
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

    new List();
    new LoadConflictos();
  }])

  .controller('ConflictosalumnoNewCtrl',['$scope', 'table', 'name', 'MessageFactory', '$mdDialog', 'service', 'ToastMD', 'Restangular', 'estados', 'conflictos',
  function($scope, table, name, MessageFactory, $mdDialog, service, ToastMD, Restangular, estados, conflictos){
    $scope.submited = false;
    $scope.title = MessageFactory.Form.New.replace('{element}',name);
    $scope.Buttons = MessageFactory.Buttons;
    $scope.message = MessageFactory.Form;
    $scope.estados = estados;
    $scope.conflictos = conflictos;
    $scope.model = {};

    //var serviceAlumnos = 

    $scope.FilterAlumnos = function(text){
      var data = [];
      angular.forEach($scope.alumnos, function(item){
        var index = item._persona.nombreCompleto.search(new RegExp(text,'i'));
        if(index>=0){
          data.push(item);
        }
      });
      return data;
    };


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

  .controller('ConflictosalumnoEditCtrl',['$scope', 'table', 'name', 'MessageFactory', 'model', 'ToastMD', '$mdDialog', 'Restangular', 'estados', 'conflictos',
  function($scope, table, name, MessageFactory, model, ToastMD, $mdDialog, Restangular, estados, conflictos){
    $scope.submited = false;

    $scope.title = MessageFactory.Form.Edit.replace('{element}',name);
    $scope.Buttons = MessageFactory.Buttons;
    $scope.estados = estados;
    $scope.conflictos = conflictos;
    $scope.model = model;



    $scope.FilterAlumnos = function(text){
      var data = [];
      angular.forEach($scope.alumnos, function(item){
        var index = item._persona.nombreCompleto.search(new RegExp(text,'i'));
        if(index>=0){
          data.push(item);
        }
      });
      return data;
    };

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
