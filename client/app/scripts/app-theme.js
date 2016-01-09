// _app-theme.js
(function() {
  'use strict';

  /**
    * @ngdoc overview
    * @name unuApp
    * @description
    * # unuApp
    *
    * Config Theme module of the application.
   */
  angular.module('unuApp')
  .constant('COLOR', {
    primary: 'teal',
    accent: 'orange'
  })
  .config(['$mdThemingProvider','COLOR',function($mdThemingProvider,COLOR) {
    // set the default palette name
    $mdThemingProvider
			.theme('default')
			.primaryPalette(COLOR.primary)
			.accentPalette(COLOR.accent,{
         'default': '500'
      })
			.backgroundPalette('grey');

  }]);

}).call(this);
