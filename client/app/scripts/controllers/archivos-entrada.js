// Generated by CoffeeScript 1.9.3
(function() {
  'use strict';

  /**
    * @ngdoc function
    * @name unuApp.controller:ArchivosBancoSalidaCtrls
    * @description
    * # ArchivosBancoSalidaCtrl
    * Controller of the unuApp
   */
  angular.module('unuApp').controller('ArchivosBancoEntradaCtrl', [
    'MessageFactory', '$rootScope', '$scope', 'Restangular', '$mdDialog', '$timeout', 'ngTableParams',
  function(MessageFactory, $rootScope, $scope, Restangular, $mdDialog, $timeout, ngTableParams) {
    var List, service;

    $scope.UI = {
      refresh: false,
      message: MessageFactory,
      title: 'Listado de Archivos Entrada',
      editMode: false,
      selected:null,
      customActions:[]
    };

    var LOCAL ={
      name: 'ArchivosEntrada',
      form:'',
      route:'archivobancos'
    };
    service = Restangular.all(LOCAL.route);
    $rootScope.app.module = ' > ' + LOCAL.name;

    List = function() {
      $scope.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        filter:{
          tipo: 'E'
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
    };

    $scope.Refresh = function Refresh(){
      $scope.UI.selected = null;
      $scope.UI.editMode = false;
      $scope.tableParams.reload();
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

    $scope.DownloadFile = function DownloadFile($event){
      var nomArchivo = $scope.UI.selected.nombre;
      $('#btnDownloadArchivo').click();
      /*service.customPOST('methods/download', {nombreArchivo:nomArchivo}).then(function(result) {
        $timeout(function() {

        }, 500);
      });*/
    };

    $scope.UploadFile = function UploadFile($event){
      
    };

    new List();
  }]);

}).call(this);
