(function(){
  'use strict';
  var controller =  function($scope,$state,  $mdSidenav){
    $scope.focusSection = function (section) {
      console.log(section);
      $state.go(section.url);
      $mdSidenav('left').toggle().then(function() {
      });
    };
  };
  controller.$inject=['$scope','$state', '$mdSidenav'];
  angular.module('unuApp')
    .run(['$templateCache', function ($templateCache) {
      $templateCache.put('partials/menu-link.tmpl.html',
        '<md-button\n' +
        ' ng-click="focusSection(section)">\n' +
        '<span ng-if="section.icon" ng-class="{\'fa {{section.icon}}\' : true}" "></span>' +
        '  {{section.title}}\n' +
        '  <span  class="md-visually-hidden "\n' +
        '    ng-if="isSelected()">\n' +
        '    current page\n' +
        '  </span>\n' +
        '</md-button>\n' +
        '');
    }])
    .directive('menuLink',['$state',  '$mdSidenav', function ($state,  $mdSidenav) {
      return {
        scope: {
          section: '='
        },
        templateUrl: 'partials/menu-link.tmpl.html',
        controller:controller
      };
    }]);
})();
