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

  angular.module('unuApp').controller('AprobacionPlanestudiosDetalleCtrl', [
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
      name: 'Detalle Plan de Estudios',
      form:'views/planestudiodetalles/form.html',
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

    $scope.ShowEvaluacion = function(){
      $mdSidenav('right')
          .toggle()
          .then(function () {
          });
      $scope.comentarios = $scope.UI.selected._revisiones;
    };

    $scope.SaveComment = function(){
      service.customPOST({comentario:$scope.newComentario},'methods/comentarios/'+$scope.UI.selected._id).then(function(result){
        ToastMD.success('Comentario Registrado satisfactoriamente');
        $scope.comentarios.push(result._revisiones[result._revisiones.length-1]);
      });
    };

    $scope.UpdateStatus = function(){
      service.customPUT({},'methods/change/'+$scope.UI.selected.estado+'/'+$scope.UI.selected._id).then(function(result){
          ToastMD.success('Estado actualizado satisfactoriamente');
          $scope.ListPlanEstudios();
      },function(result){
        console.log(result.data.error);
      });
    }

    $scope.UpdateStatusPlan = function(estado){
      var service = Restangular.all('planestudios');
      service.customPUT({},'methods/change/'+estado+'/'+LOCAL.planestudioId).then(function(data){
          ToastMD.success('Estado actualizado satisfactoriamente');
          $scope.UI.planestudios = data;
          $scope.ListPlanEstudios();
      },function(result){
        console.log(result.data.error);
      });
    }

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
        controller: 'PlanEstudioDetallesNewCtrl'
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
          planestudios: $scope.UI.planestudios
        },
        controller: 'PlanEstudioDetallesEditCtrl'
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

  }])
  .controller('PlanEstudioDetallesNewCtrl',['$scope', 'table', 'name', 'MessageFactory', 'planestudios', '$timeout','ToastMD','$mdDialog','Restangular',
  function($scope, table, name, MessageFactory, planestudios, $timeout,ToastMD,$mdDialog,Restangular){
    $scope.cursoFound = false;
    $scope.submited = false;
    $scope.title = MessageFactory.Form.New.replace('{element}',name);
    $scope.model = {_curso:{codigo:'',nombre:'',tipo:'Carrera'},_requisitos:[]};
    $scope.model._planestudio = planestudios._id;
    $scope.Buttons = MessageFactory.Buttons;
    $scope.message = MessageFactory.Form;
    var tempFilterText = '', filterTextTimeout;
    var serviceCurso = Restangular.all('cursos');
    var service = Restangular.all('planestudiodetalles');
    var LoadRequisitos = function(){
      service.getList({populate:'_curso',conditions:{_planestudio:planestudios._id}})
      .then(function(data){
        $scope.requisitos = data;
      });
    };

    $scope.FilterRequisitos = function(text){
      var data = [];
      angular.forEach($scope.requisitos,function(item){
        var index = item._curso.nombre.search(new RegExp(text,'i'));
        if(index>=0){
          data.push(item);
        }
      });
      return data;
    };
    $scope.AgregarRequisito = function(){
      $scope.model._requisitos.push($scope._requisito);
    };
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

    $scope.CalcularTotalHoras = function(){
      $scope.model.horas_total = parseInt($scope.model.horas_teoria) + parseInt($scope.model.horas_practica) + parseInt($scope.model.horas_laboratorio);
    };

    new LoadRequisitos();
  }])
  .controller('PlanEstudioDetallesEditCtrl',['$scope', 'table','name', 'MessageFactory','model','planestudios','ToastMD','$mdDialog','Restangular',
  function($scope, table,name, MessageFactory,model,planestudios,ToastMD,$mdDialog,Restangular){
    $scope.submited = false;
    $scope.model = model;
    $scope.title = MessageFactory.Form.Edit.replace('{element}',name);
    $scope.Buttons = MessageFactory.Buttons;
    var service = Restangular.all('planestudiodetalles');
    var LoadRequisitos = function(){
      service.getList({populate:'_curso',conditions:{_planestudio:planestudios._id}})
      .then(function(data){
        $scope.requisitos = data;
      });
    };
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
    $scope.AgregarRequisito = function(){
      $scope.model._requisitos.push($scope._requisito);
    };
    $scope.Cancel = function(){
      $mdDialog.hide();
    };

    $scope.CalcularTotalHoras = function(){
      $scope.model.horas_total = parseInt($scope.model.horas_teoria) + parseInt($scope.model.horas_practica) + parseInt($scope.model.horas_laboratorio);
    };

    new LoadRequisitos();
  }]);

}).call(this);
