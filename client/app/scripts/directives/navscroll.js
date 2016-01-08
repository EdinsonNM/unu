// Generated by CoffeeScript 1.9.3
(function() {
  'use strict';

  /**
    * @ngdoc directive
    * @name unuApp.directive:navscroll
    * @description
    * # navscroll
   */
  angular.module('unuApp').directive('navScroll', ['$window',function($window) {
    return function(scope, element, attrs) {
      angular.element($window).bind("scroll", function() {
        if (this.pageYOffset > 155) {
          scope.boolChangeClass = true;
        } else {
          scope.boolChangeClass = false;
        }
        scope.$apply();
      });
    };
  }]);

}).call(this);