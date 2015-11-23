
(function(){
  angular.module('unuApp')
    .run(['$templateCache', function($templateCache){
      $templateCache.put('partials/menu-toggle.tmpl.html',
        '<md-button class="md-button-toggle"\n' +
        '  ng-click="toggle(section)"\n' +
        '  aria-controls="side-menu-{{section.title | nospace}}"\n' +
        '  flex layout="row"\n' +
        '  aria-expanded="{{isOpen()}}">\n' +
        '  {{section.title}}\n' +
        '  <span aria-hidden="true" class=" pull-right fa fa-chevron-down md-toggle-icon"\n' +
        '  ng-class="{\'toggled\' : section.active}"></span>\n' +
        '</md-button>\n' +
        '<ul ng-show="section.active" id="side-menu-{{section.title | nospace}}" class="menu-toggle-list">\n' +
        '  <li ng-repeat="page in section.children">\n' +
        '    <menu-link section="page"></menu-link>\n' +
        '  </li>\n' +
        '</ul>\n' +
        '');
    }])
    .directive('menuToggle', function() {
      return {
        scope: {
          section: '=',
          toggle: '='
        },
        templateUrl: 'partials/menu-toggle.tmpl.html',
        link: function($scope) {
          $scope.isOpen = function() {
            return;
          };
          $scope.toggle = function(section) {
            section.active = !section.active;
          };
        }
      };
    });

})();
