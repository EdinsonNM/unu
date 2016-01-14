(function() {
  'use strict';
  angular.module('unuApp')
  .controller('AlumnoMisDatosCtrl',['$scope','Restangular','$rootScope',function($scope,Restangular,$rootScope){
    $scope.UI = {
      title:'Mis Datos',
      editMode: false
    };
    $rootScope.$watch('ALUMNO',function(newValue,oldValue){
        $scope.model = Restangular.copy(newValue);
    },true);

    $scope.Edit = function Edit($event) {
      $scope.UI.editMode = true;
      console.log('edit');
    };

    $scope.Save = function Save($event) {
      $scope.UI.editMode = false;
      $scope.model.save().then(function(result){
        console.log(result);
      });
    };

  }]);
}).call(this);
