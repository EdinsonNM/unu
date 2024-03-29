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

  angular.module('unuApp').controller('MICSesionaprendizajeDetalleCtrl', function($q,$stateParams, MessageFactory, $rootScope,$scope, Restangular, $mdDialog, $timeout, NgTableParams, LxDialogService, ToastMD) {
    var List, service, ListAsignaturas;

    $scope.UI = {
      refresh: false,
      message: MessageFactory,
      title: 'Registro de Sesión de Aprendizaje',
      editMode: false,
      selected:null,
      customActions:[],
      facultad: {},
      asignaturas:[],
      unidades:[]
    };

    var LOCAL ={
      planestudioId: $stateParams.id,
      name: 'Sesión de Aprendizaje',
      form:'views/planestudiodetalles/form.html',
      route:'planestudiodetalles',
      routePlan:'planestudios'
    };
    $scope.AddUnidad = function(){
      $scope.UI.unidades.push({titulo:'',inicio:'',fin:''});
    }



  });

}).call(this);
