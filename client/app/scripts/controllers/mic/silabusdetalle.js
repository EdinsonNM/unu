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

  angular.module('unuApp').controller('MICSilabusDetalleCtrl', function($q,$stateParams, MessageFactory, $rootScope,$scope, Restangular, $mdDialog, $timeout, NgTableParams, LxDialogService, ToastMD) {
    var List, service, ListAsignaturas;

    $scope.UI = {
      refresh: false,
      message: MessageFactory,
      title: 'Registro de Silabus por Plan de Estudios',
      editMode: false,
      selected:null,
      customActions:[],
      facultad: {},
      asignaturas:[],
      unidades:[]
    };

    var LOCAL ={
      planestudioId: $stateParams.id,
      name: 'Registro de Silabus por Plan de Estudios',
      form:'views/planestudiodetalles/form.html',
      route:'planestudiodetalles',
      routePlan:'planestudios'
    };
    $scope.AddUnidad = function(){
      $scope.UI.unidades.push({titulo:'',inicio:'',fin:''});
    }



  });

}).call(this);