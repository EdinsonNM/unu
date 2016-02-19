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
angular.module('unuApp').controller('CursoGrupoCrtl',
  ['$mdSidenav',
  '$q',
  'MessageFactory',
  '$rootScope',
  '$scope',
  'Restangular',
  '$mdDialog',
  '$timeout',
  'NgTableParams',
  'LxDialogService',
  'ToastMD',
  '$mdBottomSheet',
  '$state',

  function($mdSidenav, $q, MessageFactory, $rootScope, $scope, Restangular, $mdDialog, $timeout, NgTableParams, LxDialogService, ToastMD, $mdBottomSheet, $state) {
    var service,
    service1,
    serviceFacultad,
    servicePeriodo,
    idcurso;

    $scope.UI = {
      refresh: false,
      message: MessageFactory,
      title: 'Aprobación de Grupos por Cursos',
      editMode: false,
      selected: null,
      customActions: []
    };



    var LOCAL = {
      name: 'Grupos por Cursos de Plan de Estudios',
      form: 'views/aprobacion/cursos/form-grupo.html',
      route: 'planestudiodetalles',
      route1: 'grupocursos'
    };

service = Restangular.all(LOCAL.route);
service1 = Restangular.all(LOCAL.route1);
$rootScope.app.module = ' > ' + LOCAL.name;

$scope.Detail = function Detail() {
  console.log('app.aprobacioncursosperiododetalle');
  $state.go('app.aprobacioncursosperiododetalle', {
    id: $scope.UI.selected._id
  });
};

var LoadFacultades = function LoadFacultades() {
  serviceFacultad = Restangular.all('facultades');
  serviceFacultad.getList().then(function(data) {
    $scope.facultades = data;
  });
};
var LoadPeriodos = function LoadPeriodos() {
  servicePeriodo = Restangular.all('periodos');
  servicePeriodo.getList().then(function(data) {
    $scope.periodos = data;
  });
};
$scope.LoadEcuelas = function LoadEcuelas() {
  var serviceEscuela = Restangular.all('escuelas');
  serviceEscuela.getList({
    conditions: {
      _facultad: $scope.filter._facultad._id
    }
  }).then(function(data) {
    $scope.escuelas = data;
  });
};
$scope.ListPlanEstudios = function ListPlanEstudios() {
  var servicePlanestudios = Restangular.all('planestudios');
  servicePlanestudios.getList({
    conditions: {
      _escuela: $scope.filter._escuela._id
    }
  })
  .then(function(data) {
    $scope.planestudios = data;
  });
};
new LoadFacultades();
new LoadPeriodos();
/*
var nm = Restangular.all('grupocursos');
nm.getList().then(function (response) {
  console.log(response);
});
*/

$scope.ListDetallePlanEstudios = function ListDetallePlanEstudios() {
  $scope.tableParams = new NgTableParams({
    page: 1,
    count: 1000,
    filter: {
      _planestudio: $scope.filter._planestudios._id
    }
  }, {
    total: 0,
    groupBy: 'ciclo',
    counts: [],
    getData: function($defer, params) {
      var query;
      query = params.url();

      $scope.UI.refresh = true;
      service.customGET('methods/aprobacion/'+$scope.filter._periodo._id, query).then(function(result) {
        $timeout(function() {
          params.total(result.total);
          $defer.resolve(result.data);
          $scope.UI.refresh = false;
        }, 500);
      });
    }
  });
};

// $scope.AprobarCurso = function() {
//   console.log($scope.UI.selected);
//   service.customPOST({
//     _periodo: $scope.filter._periodo._id
//   }, 'methods/aprobacion/'+$scope.UI.selected._id).then(function(result) {
//     ToastMD.success('Estado actualizado satisfactoriamente');
//     $scope.Refresh();
//   }, function(result) {
//     console.log(result.data.error);
//   });
// };

$scope.Refresh = function Refresh() {
  $scope.UI.selected = null;
  $scope.UI.editMode = false;
  $scope.tableParams.reload();
};



$scope.New = function New($event){
   console.log('IDCURSO:'+idcurso);
  var parentEl = angular.element(document.body);
  $mdDialog.show({
    parent: parentEl,
    targetEvent: $event,
    templateUrl :LOCAL.form,
    locals:{
      name: LOCAL.name,
      table:$scope.tableParams,
      service: service1,
      curso: idcurso
    },
    controller: 'GrupoNewCtrl'
  });
};


$scope.filter = {};

$scope.EnabledEdit = function EnabledEdit(item, $groups) {
  console.log(item);
  console.log($groups);
  $scope.UI.editMode = false;
  $scope.UI.selected = null;

  angular.forEach($groups,function(group){
    angular.forEach(group.data,function(element){
      if(item._id !== element._id){
         console.log(item._id);
         idcurso = item._id;
        element.active = false;
      }
    });
  });

  if (item.active) {
    $scope.UI.editMode = true;
    $scope.UI.selected = item;
    $scope.UI.selected.route = LOCAL.route;
  }
};
}
])

.controller('GrupoNewCtrl', ['$scope', 'table', 'curso', 'name', 'MessageFactory', 'service', 'ToastMD', '$mdDialog',
  function($scope, table, curso, name, MessageFactory, service, ToastMD, $mdDialog){
    $scope.submited = false;
    $scope.title = MessageFactory.Form.New.replace('{element}',name);
    $scope.Buttons = MessageFactory.Buttons;
    $scope.model = {};
    $scope.model._cursoAperturadoPeriodo = curso;

    $scope.Save = function(form) {
      $scope.submited = true;
      if (form.$valid) {
        //declaro el servicio con la ruta correcta del endpoint.
         console.log($scope.model);

        service.post($scope.model).then(function() {
          ToastMD.info(MessageFactory.Form.Saved);
          $mdDialog.hide();
          table.reload();
        }, function(error){
          switch (error.status) {
            case 422:
              $scope.ValidationError = error.data;
              break;
            default:
          }
       },function(result){
          ToastMD.error(result.data.message);


       });
      }
    };
    $scope.Cancel = function(){
      $mdDialog.hide();
    };
}]);
}).call(this);
