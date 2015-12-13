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

  angular.module('unuApp').controller('MICRevisionPlanEstudiosCtrl', function($q,$stateParams, MessageFactory, $rootScope,$scope, Restangular, $mdDialog, $timeout, NgTableParams, LxDialogService, ToastMD) {
    var List, service, ListAsignaturas;




    $scope.UI = {
      refresh: false,
      message: MessageFactory,
      title: 'Validación del Plan de Estudios',
      editMode: false,
      selected:null,
      customActions:[],
      facultad: {},
      asignaturas:[],
      asignaturasNoexistentes:[]
    };

    var LOCAL ={
      planestudioId: $stateParams.id,
      name: 'Validación del Plan de Estudios',
      form:'views/planestudiodetalles/form.html',
      route:'planestudiodetalles',
      routeAsignaturas:'mic_asignaturas'
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

    ListAsignaturas = function(){
      var service = Restangular.all(LOCAL.routeAsignaturas);
      service.getList({populate:{path:'_curso'}}).then(function(data){
        $scope.UI.asignaturas = data;
      });
    };

    List = function() {
      $scope.tableParams = new NgTableParams({
        page: 1,
        count: 500,
        filter: {_planestudio: LOCAL.planestudioId}
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
          planestudios: $scope.UI.planestudios
        },
        controller: function($scope, table, name, MessageFactory, planestudios, $timeout){
          $scope.cursoFound = false;
          $scope.submited = false;
          $scope.title = MessageFactory.Form.New.replace('{element}',name);
          $scope.model = {_curso:{codigo:'',nombre:'',tipo:'Carrera'}};
          $scope.model._planestudio = planestudios._id;
          $scope.Buttons = MessageFactory.Buttons;
          $scope.message = MessageFactory.Form;
          var tempFilterText = '', filterTextTimeout;
          var serviceCurso = Restangular.all('cursos');
          var service = Restangular.all('planestudiodetalles');
          $scope.$watch('model._curso.codigo', function (val) {
            if(val.length>0){
              if (filterTextTimeout){
                $timeout.cancel(filterTextTimeout);
              }
              tempFilterText = val;
              filterTextTimeout = $timeout(function() {
                  $scope.model._curso.codigo = tempFilterText;
                  serviceCurso.getList({conditions:{ codigo:$scope.model._curso.codigo }}).then(function(data){
                    if(data.length>0){
                      $scope.model._curso = data[0];
                      $scope.cursoFound = true;
                    }else{
                      $scope.model._curso = {codigo:tempFilterText};
                      $scope.cursoFound = false;
                    }
                  });
              }, 1000);
            }
          });

          $scope.Save = function(form) {
            $scope.submited = true;
            if (form.$valid) {
              if(!$scope.cursoFound){
                serviceCurso.post($scope.model._curso).then(function(data){
                  $scope.model._curso = data._id;
                  new Save();
                });
              }else{
                new Save();
              }

            }
          };
          var Save = function(){
            service.post($scope.model).then(function() {
              ToastMD.info(MessageFactory.Form.Saved);
              $mdDialog.hide();
              table.reload();
            });
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
    new ListAsignaturas();

  });

}).call(this);
