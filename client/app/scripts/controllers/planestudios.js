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
  angular.module('unuApp').controller('PlanestudiosCtrl',[
  '$window','$mdSidenav', '$q', 'MessageFactory', '$rootScope', '$scope', 'Restangular', '$mdDialog', '$timeout', 'NgTableParams', 'LxDialogService', 'ToastMD', '$mdBottomSheet', '$state',
  function($window,$mdSidenav, $q, MessageFactory, $rootScope, $scope, Restangular, $mdDialog, $timeout, NgTableParams, LxDialogService, ToastMD, $mdBottomSheet, $state) {
    var List, service, store;
    store = $window.localStorage;
    $scope.UI = {
      refresh: false,
      message: MessageFactory,
      title: 'Listado de Planes de Estudio',
      editMode: false,
      selected:null,
      customActions:[]
    };

    var LOCAL ={
      name: 'Plan de Estudio',
      form:'views/planestudios/form.html',
      route:'planestudios'
    };
    service = Restangular.all(LOCAL.route);
    $rootScope.app.module = ' > ' + LOCAL.name;


    //custom actions: Es un array [{label:'Nombre Acción',onclick: function(){}}]
    $scope.UI.customActions.push({icon:'fa-book',label:'Detalle Plan de Estudio', onclick: function(){
      $state.go('app.planestudiodetalles', { id: $scope.UI.selected._id });
    }});
    $scope.UI.customActions.push({icon:'fa-send',label:'Enviar para aprobación', onclick: function(){
      service.customPUT({},'methods/change/Pendiente/'+$scope.UI.selected._id).then(function(result){
          $scope.ListPlanEstudios();
      },function(result){
        console.log(result.data.error);
      });

    }});
    //end custom actions



    var LoadFacultades = function LoadFacultades() {
      var serviceFacultad = Restangular.all('facultades');
      serviceFacultad.getList().then(function(data){
        $scope.facultades = data;
        console.log(store.getItem('facultadSelected'));
        if(store.getItem('facultadSelected')){
          $scope.filter._facultad = JSON.parse(store.getItem('facultadSelected'));
        }

      });
    };
    $scope.LoadEcuelas = function LoadEcuelas(){
      store.setItem('facultadSelected', JSON.stringify($scope.filter._facultad));
      var serviceEscuela = Restangular.all('escuelas');
      serviceEscuela.getList({conditions:{_facultad:$scope.filter._facultad._id},populate:'_facultad'}).then(function(data){
        $scope.escuelas = data;
        if(store.getItem('escuelaSelected')){
          $scope.filter._escuela = JSON.parse(store.getItem('escuelaSelected'));
        }
      });
    };

    $scope.ListPlanEstudios = function ListPlanEstudios(){
      store.setItem('escuelaSelected', JSON.stringify($scope.filter._escuela));
      angular.extend($scope.tableParams.filter(), {_escuela:$scope.filter._escuela._id});
      //$scope.tableParams.reload();
    };
    new LoadFacultades();

    List = function() {
      $scope.tableParams = new NgTableParams({
        page: 1,
        count: 10,
        filter:{
          _escuela:0
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

    $scope.filter = {};
    $scope.New = function New($event){
      if(!$scope.filter._escuela){
        ToastMD.warning('Debe seleccionar una escuela antes de crear un plan de estudio');
        return;
      }

      var parentEl = angular.element(document.body);
      $mdDialog.show({
        parent: parentEl,
        targetEvent: $event,
        templateUrl :LOCAL.form,
        locals:{
          name: LOCAL.name,
          table:$scope.tableParams,
          escuela: $scope.filter._escuela,
          service:service
        },
        controller: 'PlanestudiosNewCtrl'
      });
    };
    $scope.Edit = function Edit($event){
      var parentEl = angular.element(document.body);
      $mdDialog.show({
        parent: parentEl,
        targetEvent: $event,
        templateUrl :LOCAL.form,
        locals:{
          name: LOCAL.name,
          table:$scope.tableParams,
          model: Restangular.copy($scope.UI.selected),
          escuela: $scope.filter._escuela
        },
        controller: 'PlanestudiosEditCtrl'
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
          ToastMD.info(MessageFactory.Form.Deleted);
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
  }])

  .controller('PlanestudiosNewCtrl',[
    '$scope', 'name', 'table', 'escuela', 'MessageFactory', 'service', 'Restangular', 'ToastMD', '$mdDialog',
  function($scope, name, table, escuela, MessageFactory, service, Restangular, ToastMD, $mdDialog){
    $scope.escuela = escuela;
    $scope.submited = false;
    $scope.title = MessageFactory.Form.New.replace('{element}',name);
    $scope.Buttons = MessageFactory.Buttons;
    $scope.message = MessageFactory.Form;
    Restangular.all('periodos').getList().then(function(data){
      $scope.periodos = data;
    });
    $scope.model = {
      _escuela: escuela._id
    };
    $scope.Save = function(form) {
      $scope.submited = true;
      if (form.$valid) {
        service.post($scope.model).then(function() {
          ToastMD.info(MessageFactory.Form.Saved);
          $mdDialog.hide();
          table.reload();
        });
      }
    };
    $scope.Cancel = function(){
      $mdDialog.hide();
    };
  }])
  .controller('PlanestudiosEditCtrl',['$scope', 'table', 'name', 'model', 'escuela', 'MessageFactory', 'Restangular', 'ToastMD', '$mdDialog',
  function($scope, table, name, model, escuela, MessageFactory, Restangular, ToastMD, $mdDialog){
    $scope.escuela = escuela;
    $scope.submited = false;
    $scope.model = model;
    $scope.model.fecha_resolucion = new Date($scope.model.fecha_resolucion);
    $scope.title = MessageFactory.Form.Edit.replace('{element}',name);
    $scope.Buttons = MessageFactory.Buttons;
    Restangular.all('periodos').getList().then(function(data){
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
    $scope.Cancel = function(){
      $mdDialog.hide();
    };
  }]);

}).call(this);
