// Generated by CoffeeScript 1.9.3
(function() {
  'use strict';

  /**
    * @ngdoc function
    * @name unuApp.controller:EscuelasCtrl
    * @description
    * # EscuelasCtrl
    * Controller of the unuApp
   */

  angular.module('unuApp').controller('PlanEstudioDetallesCtrl', function($stateParams, MessageFactory, $rootScope,$scope, Restangular, $mdDialog, $timeout, ngTableParams, LxDialogService, ToastMD, $state) {
    var List, service;

    $scope.UI = {
      refresh: false,
      message: MessageFactory,
      title: 'Listado de Cursos del Plan de Estudios',
      editMode: false,
      selected:null,
      customActions:[],
      facultad: {}
    };

    var LOCAL ={
      planestudio_id: $stateParams.id,
      name: 'Detalle Plan de Estudios',
      form:'views/planestudiodetalles/form.html',
      route:'escuelas'
    };

    Restangular.one('planestudios', LOCAL.planestudio_id).get({single: true}).then(function(data){
      $scope.UI.facultad = data;
    });

    service = Restangular.all(LOCAL.route);
    $rootScope.app.module = ' > ' + LOCAL.name;

    List = function() {
      $scope.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        filter: {_planestudio: LOCAL.planestudioId}
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
          facultad: $scope.UI.facultad
        },
        controller: function($scope, table, name, MessageFactory, facultad){
          $scope.submited = false;
          $scope.title = MessageFactory.Form.New.replace('{element}',name);
          $scope.model = {};
          $scope.model._facultad = facultad._id;
          $scope.facultad = facultad;
          $scope.Buttons = MessageFactory.Buttons;
          $scope.message = MessageFactory.Form;
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
        }
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
        controller: function($scope, table,name, MessageFactory,model){
          $scope.submited = false;
          $scope.model = model;
          $scope.title = MessageFactory.Form.Edit.replace('{element}',name);
          $scope.Buttons = MessageFactory.Buttons;
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
        }
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

  });

}).call(this);
