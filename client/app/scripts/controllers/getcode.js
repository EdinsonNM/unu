// Generated by CoffeeScript 1.9.3
(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name unuApp.controller:LoginCtrl
   * @description
   * # LoginCtrl
   * Controller of the unuApp
   */
  angular.module('unuApp').controller('GetCodeCtrl', [
    '$scope', 'Restangular', '$rootScope',
    function($scope, Restangular, $rootScope) {
        $scope.model = {};
        var service = Restangular.all("alumnos");
        service.customPOST('getCode', {email: $scope.model.email}).then(function(result) {
            console.log(result);
        });
    }
  ]);

}).call(this);
