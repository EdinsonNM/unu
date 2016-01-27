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

  angular.module('unuApp').controller('AprobacionCursosPeriodoDetalleCtrl', [
  '$mdSidenav', '$q', '$stateParams', 'MessageFactory', '$rootScope', '$scope', 'Restangular', '$mdDialog', '$timeout', 'NgTableParams', 'LxDialogService', 'ToastMD', '$state',
  function($mdSidenav, $q, $stateParams, MessageFactory, $rootScope, $scope, Restangular, $mdDialog, $timeout, NgTableParams, LxDialogService, ToastMD, $state) {
    var List, service;

    $scope.UI = {
      refresh: false,
      message: MessageFactory,
      title: 'Plan de Estudios',
      editMode: false,
      selected:null,
      customActions:[],
      facultad: {}
    };

    var LOCAL ={
      planestudioId: $stateParams.id,
      name: 'Detalle Plan de Estudios - Aprobación de Cursos',
      route:'planestudiodetalles'
    };

    Restangular.one('planestudios', LOCAL.planestudioId).get({single: true,populate:'_periodo _escuela'}).then(function(data){
      $scope.UI.planestudios = data;
    });

    service = Restangular.all(LOCAL.route);
    $rootScope.app.module = ' > ' + LOCAL.name;

    //custom actions: Es un array [{label:'Nombre Acción',onclick: function(){}}]
    $scope.UI.customActions.push({icon:'fa-comments-o',label:'Comentarios', onclick: function(){
      $mdSidenav('right')
        .toggle()
        .then(function () {
        });
      console.log($scope.UI.selected);
      $scope.comentarios = $scope.UI.selected._revisiones;
    }});

    $scope.UpdateStatus = function(){
      service.customPUT({},'methods/change/'+$scope.UI.selected.estado+'/'+$scope.UI.selected._id).then(function(result){
          ToastMD.success('Estado actualizado satisfactoriamente');
          $scope.ListPlanEstudios();
      },function(result){
        console.log(result.data.error);
      });
    }

    $scope.AprobarCurso = function(){
        service.customPUT({},'methods/aprobar/'+$scope.UI.selected.estado+'/'+$scope.UI.selected._id).then(function(result){
            ToastMD.success('Estado actualizado satisfactoriamente');
            $scope.ListPlanEstudios();
        },function(result){
          console.log(result.data.error);
        });
    };


    List = function() {
      $scope.tableParams = new NgTableParams({
        page: 1,
        count: 1000,
        filter: {_planestudio: LOCAL.planestudioId}
      }, {
        total: 0,
        groupBy: 'ciclo',
         counts: [] ,
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

    $scope.getCreditosCiclo = function(data){
      var total = 0;
      angular.forEach(data,function(item){
        total+= item.creditos;
      });
      return total;
    };

    $scope.getHorasCiclo = function(data){
      var total = 0;
      angular.forEach(data,function(item){
        total+= item.horas_total;
      });
      return total;
    };

    $scope.Refresh = function Refresh(){
      $scope.UI.selected = null;
      $scope.UI.editMode = false;
      $scope.tableParams.reload();
    };

    $scope.EnabledEdit =function EnabledEdit(item,$groups){
      console.log($groups);
      $scope.UI.editMode = false;
      $scope.UI.selected = null;
      angular.forEach($groups,function(group){
        angular.forEach(group.data,function(element){
          if(item._id !== element._id){
            element.active = false;
          }
        });
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
