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

  angular.module('unuApp').controller('MICSilabusCtrl', function($state,$q,$stateParams, MessageFactory, $rootScope,$scope, Restangular, $mdDialog, $timeout, NgTableParams) {
    var List, service;

    $scope.UI = {
      refresh: false,
      message: MessageFactory,
      title: 'Registro de Silabus por Plan de Estudios',
      editMode: false,
      selected:null,
      customActions:[],
      facultad: {},
      asignaturas:[],
      asignaturasNoexistentes:[]
    };

    var LOCAL ={
      planestudioId: $stateParams.id,
      name: 'Registro de Silabus por Plan de Estudios',
      form:'views/planestudiodetalles/form.html',
      route:'planestudiodetalles',
      routePlan:'planestudios'
    };

    Restangular.one('planestudios', LOCAL.planestudioId).get({single: true}).then(function(data){
      $scope.UI.planestudios = data;
    });

    service = Restangular.all(LOCAL.route);
    $rootScope.app.module = ' > ' + LOCAL.name;

    var LoadFacultades = function LoadFacultades() {
      var serviceFacultad = Restangular.all('facultades');
      serviceFacultad.getList().then(function(data){
        $scope.facultades = data;
      });
    };
    $scope.LoadEcuelas = function LoadEcuelas(){
      var serviceEscuela = Restangular.all('escuelas');
      serviceEscuela.getList({conditions:{_facultad:$scope.filter._facultad._id},populate:'_facultad'}).then(function(data){
        $scope.escuelas = data;
      });
    };
    $scope.LoadPlanEstudios = function LoadPlanEstudios(){
      $scope.planes = [];
      var servicePlan = Restangular.all(LOCAL.routePlan);
      servicePlan.getList({conditions:{_escuela:$scope.filter._escuela._id},populate:'_escuela'}).then(function(data){
        $scope.planes = data;
      });
    };



    List = function() {
      $scope.tableParams = new NgTableParams({
        page: 1,
        count: 500,
        filter: {_planestudio: 0}
      }, {
        total: 0,
        groupBy: 'ciclo',
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

    $scope.RevisarPlan = function(){
      angular.forEach($scope.UI.asignaturas,function(asignatura){
        var existe = false;
        angular.forEach($scope.tableParams.data,function(group){
          angular.forEach(group.data,function(item){
              if(item._curso._id === asignatura._curso._id){
                item.existsAsignatura = true;
                existe = true;
              }
          });
        });
        if(!existe){
          $scope.UI.asignaturasNoexistentes.push(asignatura);
        }
      });
    };

    $scope.Refresh = function Refresh(){
      $scope.UI.selected = null;
      $scope.UI.editMode = false;
      $scope.tableParams.filter({_planestudio: $scope.filter._planestudio._id});
      $scope.tableParams.reload();
    };


    $scope.Edit = function Edit($event){
      $state.go('app.mic_silabus_detalle',{id:$scope.UI.selected._id});
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
    new LoadFacultades();

  });

}).call(this);
