(function() {
  'use strict';
  angular.module('unuApp')
  .controller('AlumnoMisDatosCtrl', ['$scope', 'Restangular', '$rootScope', function($scope, Restangular, $rootScope){
    var LOCAL = {
        route:'alumnos',
        route1:'personas'
    };
    $scope.editable = false;
    $scope.UI = {
      title: 'Mis Datos',
      editMode: false
    };
    $scope.model = {};
    //console.log($rootScope);
    $rootScope.$watch('ALUMNO', function(newValue, oldValue){
        $scope.model = Restangular.copy(newValue);
        $scope.model.fechaNacimiento = new Date($scope.model.fechaNacimiento);
    },true);


    var service = Restangular.all(LOCAL.route1);

    service.customGET('model/sexo', {}).then(function(result){
      $scope.sexo = result; //sexo = result;
    });

    $scope.Edit = function Edit($event) {
      $scope.UI.editMode = true;
      $scope.editable = true;
      ToastMD.success(MessageFactory.Form.AllowEdit);
      console.log('edit');
    };

    $scope.Save = function Save($event) {
      $scope.UI.editMode = false;
      $scope.model.put().then(function(result){
          $scope.editable = false;
          ToastMD.success(MessageFactory.Form.Updated);
          console.log(result);
      });
    };

  }]);
}).call(this);
