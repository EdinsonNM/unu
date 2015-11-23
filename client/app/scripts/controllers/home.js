(function(){
  'use strict';

  angular.module('unuApp')

    .controller('HomeCtrl',
      //function ($rootScope, $log, $state, $timeout, $location, menu) {
      function($scope, UserFactory, $rootScope, $mdSidenav, $log, $state, menu) {

        var vm = this;
        var aboutMeArr = ['Family', 'Location', 'Lifestyle'];
        var budgetArr = ['Housing', 'LivingExpenses', 'Healthcare', 'Travel'];
        var incomeArr = ['SocialSecurity', 'Savings', 'Pension', 'PartTimeJob'];
        var advancedArr = ['Assumptions', 'BudgetGraph', 'AccountBalanceGraph', 'IncomeBalanceGraph'];

        //functions for menu-link and menu-toggle
        vm.isOpen = isOpen;
        vm.toggleOpen = toggleOpen;
        vm.isSectionSelected = isSectionSelected;
        vm.autoFocusContent = false;
        vm.menu = menu;
        vm.close = close;

        console.log('menu: ', vm.menu);

        vm.status = {
          isFirstOpen: true,
          isFirstDisabled: false
        };

        $scope.close = function() {
          return $mdSidenav('left').toggle().then(function() {
            $log.debug('close sidenav');
          });
        }

        function isOpen(section) {
          return menu.isSectionSelected(section);
        }

        $scope.toggleOpen = function(section) {
          menu.toggleSelectSection(section);
        }

        function isSectionSelected(section) {
          var selected = false;
          var openedSection = menu.openedSection;
          if(openedSection === section){
            selected = true;
          }
          else if(section.children) {
            section.children.forEach(function(childSection) {
              if(childSection === openedSection){
                selected = true;
              }
            });
          }
          return selected;
        }

      })
})();
