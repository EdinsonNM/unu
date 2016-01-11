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

    var defaultPalette = 'teal';
    // define a palette to darken the background of components
    var greyBackgroundMap = $mdThemingProvider.extendPalette(defaultPalette, {'A100': 'fafafa'});

    $mdThemingProvider.definePalette('grey-background', greyBackgroundMap);
    $mdThemingProvider.setDefaultTheme(defaultPalette);


    $mdThemingProvider
			.theme('teal')
			.primaryPalette(COLOR.primary)
			.accentPalette(COLOR.accent,{
         'default': '500'
      })
			.backgroundPalette('grey');

  }]);

}).call(this);
