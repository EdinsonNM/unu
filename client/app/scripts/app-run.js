// _app-run.js
(function() {
  'use strict';
  angular.module('unuApp')
  .run(['$rootScope','COLOR',function($rootScope,COLOR) {
    $rootScope.color = COLOR;
    $rootScope.inProgress = false;
    $rootScope.app = {
      name: 'Sistema de Matrícula',
      module:'',
      corporation: 'Universidad Nacional de Ucayali',
      developer: 'Edinson Nuñez More',
      isTest: true
    };
    $rootScope.errors = {
      required: 'Campo es requerido',
      email: 'Campo email inválido',
      validateUnique: 'Valor ya registrado'
    };
    $rootScope.Buttons = {
      Save: 'Guardar',
      Cancel: 'Cancelar',
      New: 'Nuevo'
    };

  }]);

}).call(this);
