// Generated by CoffeeScript 1.9.3
(function() {
  'use strict';

  /**
    * @ngdoc directive
    * @name unuApp.directive:ValidateUnique
    * @description
    * # ValidateUnique
   */
  angular.module('unuApp').directive('validateUnique', ['Restangular','$timeout',function(Restangular,$timeout) {
    return {
      require: 'ngModel',
      scope: {
        attribute: '@',
        minlengthvalidation: '@',
        queryModel: '@',
        url: '@',
        filtertimeout:'='
      },
      link: function(scope, element, attrs, ctrl) {
        scope.minlengthvalidation = scope.minlengthvalidation || 0;
        var delay = function(callback){
          if (scope.filterTimeout){
            $timeout.cancel(scope.filterTimeout);
          }
          scope.filterTimeout = $timeout(function() {
            callback();
          },1000);
        };
        return ctrl.$parsers.unshift(function(value) {


          var localService;
          delay(function() {
            localService = Restangular.all(scope.queryModel);
              localService.customGET('/methods/validate-unique', {
                value: value,
                attribute:scope.attribute
              }).then(function(result) {
                if (result.success) {
                  return ctrl.$setValidity('validateUnique', true);
                } else {
                  return ctrl.$setValidity('validateUnique', false);
                }
              });
          });
          return value;
        });
      }
    };
  }]);

}).call(this);
