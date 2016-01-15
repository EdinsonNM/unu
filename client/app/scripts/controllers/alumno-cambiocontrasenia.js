(function() {
  'use strict';
  angular.module('unuApp')
  .controller('AlumnoCambioContraseniaCtrl',['$scope','Restangular','$rootScope', 'ToastMD', 'MessageFactory',function($scope,Restangular,$rootScope,ToastMD,MessageFactory){
    var service = Restangular.all('usuarios');
    $scope.UI = {
      title:'Cambio Contraseña',
      message: MessageFactory
    };
    $rootScope.$watch('ALUMNO',function(newValue,oldValue){
        $scope.model = Restangular.copy(newValue);
    },true);

    $scope.Save = function Save($event) {
      service.customPUT($scope.model,'auth/change-password').then(function(res){
        ToastMD.success('Contraseña cambiada correctamente.');
      },
      function(res){
        ToastMD.warning(res.data.message);
      });
    };

  }]);
}).call(this);
