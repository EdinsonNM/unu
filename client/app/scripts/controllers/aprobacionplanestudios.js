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
  angular.module('unuApp').controller('AprobacionPlanestudiosCtrl',
  ['$mdSidenav','$q','MessageFactory', '$rootScope','$scope', 'Restangular', '$mdDialog', '$timeout', 'NgTableParams', 'LxDialogService', 'ToastMD', '$mdBottomSheet','$state',
  function($mdSidenav,$q,MessageFactory, $rootScope,$scope, Restangular, $mdDialog, $timeout, NgTableParams, LxDialogService, ToastMD, $mdBottomSheet, $state) {
    var List, service;

    $scope.UI = {
      refresh: false,
      message: MessageFactory,
      title: 'Aprobación de Planes de Estudio',
      editMode: false,
      selected:null,
      customActions:[]
    };

    var LOCAL ={
      name: 'Aprobación Plan de Estudio',
      form:'views/planestudios/form.html',
      route:'planestudios'
    };
    service = Restangular.all(LOCAL.route);
    $rootScope.app.module = ' > ' + LOCAL.name;

    $scope.Detail = function Detail(){
      $state.go('app.aprobacionplanestudiosdetalle', { id: $scope.UI.selected._id });
    };




    List = function() {
      $scope.tableParams = new NgTableParams({
        page: 1,
        count: 10,
        filter:{
          estado:'Pendiente'
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
  }]);

}).call(this);
