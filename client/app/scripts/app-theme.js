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
  .config(['$mdThemingProvider',function($mdThemingProvider) {
    // set the default palette name
    var defaultPalette = 'teal';
    // define a palette to darken the background of components
    var greyBackgroundMap = $mdThemingProvider.extendPalette(defaultPalette, {'A100': 'fafafa'});

    $mdThemingProvider.definePalette('grey-background', greyBackgroundMap);
    $mdThemingProvider.setDefaultTheme(defaultPalette);

    $mdThemingProvider
			.theme(defaultPalette)
			.primaryPalette(defaultPalette)
			.accentPalette('pink')
			.backgroundPalette('grey-background');
    /*$mdThemingProvider
      .theme('default')
        .primaryPalette('teal', {
          'default': '600'
        })
        .accentPalette('pink', {
          'default': '500'
        })
        .warnPalette('defaultPrimary');

    /*$mdThemingProvider.theme('dark', 'default')
      .primaryPalette('defaultPrimary')
      .dark();

    $mdThemingProvider.theme('green', 'default')
      .primaryPalette('teal');

    $mdThemingProvider.theme('custom', 'default')
      .primaryPalette('defaultPrimary', {
        'hue-1': '50'
    });

    $mdThemingProvider.definePalette('defaultPrimary', {
      '50':  '#000000',
      '100': 'rgb(255, 198, 197)',
      '200': '#E75753',
      '300': '#E75753',
      '400': '#E75753',
      '500': '#E75753',
      '600': '#E75753',
      '700': '#E75753',
      '800': '#E75753',
      '900': '#E75753',
      'A100': '#E75753',
      'A200': '#E75753',
      'A400': '#E75753',
      'A700': '#E75753'
    });*/

  }]);

}).call(this);
