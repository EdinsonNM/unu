(function() {
  'use strict';
  angular.module('unuApp')
  .controller('AlumnoMisDatosCtrl', ['$scope', 'Restangular', '$rootScope', function($scope, Restangular, $rootScope){
    var LOCAL = {
        route:'alumnos'
    };
    $scope.UI = {
      title: 'Mis Datos',
      editMode: false
    };
    console.log($rootScope);
    $rootScope.$watch('ALUMNO', function(newValue, oldValue){
        $scope.model = Restangular.copy(newValue);
    },true);

    var service = Restangular.all(LOCAL.route);

    service.customGET('model/sexo', {}).then(function(result){
      $scope.sexo = result; //sexo = result;
    });

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
