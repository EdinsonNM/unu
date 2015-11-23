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
  angular.module('unuApp').controller('LoginCtrl', function($scope, UserFactory, $rootScope) {
    $scope.Login = function() {
      UserFactory.login($scope.user);
    };
    $scope.Reset = function() {};
  });

}).call(this);
