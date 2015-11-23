(function(){
  'use strict';

  angular.module('unuApp')
    .run(['$templateCache', function ($templateCache) {
      $templateCache.put('partials/menu-link.tmpl.html',
        '<md-button ng-class="{\'{{section.icon}}\' : true}" \n' +
        ' ng-click="focusSection(section)">\n' +
        '  {{section.title}}\n' +
        '  <span  class="md-visually-hidden "\n' +
        '    ng-if="isSelected()">\n' +
        '    current page\n' +
        '  </span>\n' +
        '</md-button>\n' +
        '');
    }])
    .directive('menuLink', function ($state,  $mdSidenav) {
      return {
        scope: {
          section: '=',
          focusSection: '='
        },
        templateUrl: 'partials/menu-link.tmpl.html',
        link: function ($scope, $element) {

        },
        controller: function($scope,$state,  $mdSidenav){
          $scope.focusSection = function (section) {
            console.log(section);
            $state.go(section.url);
            $mdSidenav('left').toggle().then(function() {
            });
          };
        }
      };
    });
})();
