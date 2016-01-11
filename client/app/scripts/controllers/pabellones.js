// Generated by CoffeeScript 1.9.3
(function() {
  'use strict';

  /**
    * @ngdoc function
    * @name unuApp.controller:PabellonesCtrl
    * @description
    * # PabellonesCtrl
    * Controller of the unuApp
   */
  angular.module('unuApp').controller('PabellonesCtrl', [
    'MessageFactory', '$rootScope', '$scope', 'Restangular', '$mdDialog', '$timeout', 'ngTableParams', 'ToastMD', '$mdBottomSheet', '$state',
  function(MessageFactory, $rootScope,$scope, Restangular, $mdDialog, $timeout, ngTableParams, ToastMD, $mdBottomSheet, $state) {
    var List, service;

    $scope.UI = {
      refresh: false,
      message: MessageFactory,
      title: 'Listado de Pabellones',
      editMode: false,
      selected:null,
      customActions:[]
    };

    var LOCAL ={
      name: 'Pabellon',
      form:'views/pabellones/form.html',
      route:'pabellones'
    };
    service = Restangular.all(LOCAL.route);
    $rootScope.app.module = ' > ' + LOCAL.name;

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
        templateUrl :LOCAL.form,
        locals:{
          name: LOCAL.name,
          table:$scope.tableParams,
          service: service
        },
        controller: 'PabellonNewCtrl'
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
          model: Restangular.copy($scope.UI.selected)
        },
        controller: 'PabellonEditCtrl'
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
  }])

  .controller('PabellonNewCtrl',['$scope', 'table', 'name', 'MessageFactory', '$mdDialog', 'service', 'ToastMD',
  function($scope, table, name, MessageFactory, $mdDialog, service, ToastMD){
    $scope.submited = false;
    $scope.title = MessageFactory.Form.New.replace('{element}',name);
    $scope.Buttons = MessageFactory.Buttons;
    $scope.message = MessageFactory.Form;
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

  .controller('PabellonEditCtrl',['$scope', 'table', 'name', 'MessageFactory', 'model', 'ToastMD', '$mdDialog',
  function($scope, table, name, MessageFactory, model, ToastMD, $mdDialog){
    $scope.submited = false;
    $scope.model = model;
    $scope.title = MessageFactory.Form.Edit.replace('{element}',name);
    $scope.Buttons = MessageFactory.Buttons;
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
