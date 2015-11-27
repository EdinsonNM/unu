// Generated by CoffeeScript 1.9.3
(function() {
  'use strict';

  /**
    * @ngdoc overview
    * @name unuApp
    * @description
    * # unuApp
    *
    * Main module of the application.
   */
  angular.module('unuApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'lumx',
    'ui.router',
    'restangular',
    'angular-loading-bar',
    'ngTable',
    'anim-in-out',
    'ngMaterial',
    'scDateTime'
  ]).config(function($stateProvider, $urlRouterProvider, RestangularProvider, $httpProvider, $mdThemingProvider) {
    $mdThemingProvider
      .theme('default')
        .primaryPalette('green', {
          'default': '600'
        })
        .accentPalette('teal', {
          'default': '500'
        })
        .warnPalette('defaultPrimary');

    $mdThemingProvider.theme('dark', 'default')
      .primaryPalette('defaultPrimary')
      .dark();

    $mdThemingProvider.theme('green', 'default')
      .primaryPalette('green');

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
    });
    RestangularProvider.setBaseUrl('/api');
    $httpProvider.interceptors.push('AuthInterceptor');
    RestangularProvider.setRestangularFields({ id: '_id' });
    $urlRouterProvider.otherwise('/');
    $stateProvider.state('app', {
      url: '/home',
      views: {
        '@':{
          templateUrl: 'views/app.html',
          controller: 'AppCtrl as vm'
        }
      },

      resolve: {
        DataResolve: function(UserFactory, $q, $rootScope) {
          var deferred;
          deferred = $q.defer();
          UserFactory.getUser().then(function(result) {
            $rootScope.USER = result.user;
            //console.log(result.user);
            deferred.resolve(true);
          });
          return deferred.promise;
        }
      }
    }).state('appalumno', {
      url: '/home-alumno',
      templateUrl: 'views/appalumno.html',
      controller: 'AppAlumnoCtrl',
      resolve: {
        DataResolve: function(UserFactory, OracleRestangular, $q, $rootScope) {
          var deferred;
          deferred = $q.defer();
          UserFactory.getUser().then(function(result) {
            var service;
            $rootScope.USER = result.user;
            service = OracleRestangular.all('alumno');
            service.customGET('', {
              'filter[cod_alumno]': $rootScope.USER.username
            }).then(function(result) {
              if (result.data.length > 0) {
                $rootScope.ALUMNO = result.data[0];
                deferred.resolve(true);
              }
            });
          });
          return deferred.promise;
        }
      }
    })
    .state('appalumno.inicio', {
      url: '/inicio',
      templateUrl: 'views/appalumno_inicio.html',
      controller: 'AppalumnoinicioCtrl'
    })
    .state('appalumno.matricula', {
      url: '/matricula',
      templateUrl: 'views/appalumno_matricula.html',
      controller: 'AppalumnomatriculaCtrl'
    })
    .state('appalumno.matricularegister', {
      url: '/matricula-register',
      templateUrl: 'views/appalumno_matricula_register.html',
      controller: 'AppalumnomatricularegisterCtrl'
    })
    .state('login', {
      url: '/',
      templateUrl: 'views/login.html',
      controller: 'LoginCtrl'
    })
    .state('app.facultad', {
      url: '/facultades',
      templateUrl: 'views/facultades/list.html',
      controller: 'FacultadesCtrl'
    })
    .state('app.escuelas', {
      url: '/facultades/:id/escuelas',
      templateUrl: 'views/escuelas/list.html',
      controller: 'EscuelasCtrl'
    })
    .state('app.aulas', {
    url: '/aulas',
    templateUrl: 'views/aulas/list.html',
    controller: 'AulasCtrl'
    })
    .state('app.pabellones', {
    url: '/pabellones',
    templateUrl: 'views/pabellones/list.html',
    controller: 'PabellonesCtrl'
    })
    .state('app.docentes', {
    url: '/docentes',
    templateUrl: 'views/docentes/list.html',
    controller: 'DocentesCtrl'
    })
    .state('app.periodos', {
      url: '/periodos',
      templateUrl: 'views/periodos/list.html',
      controller: 'PeriodosCtrl'
    })
    .state('app.cursos', {
      url: '/cursos',
      templateUrl: 'views/cursos/list.html',
      controller: 'CursosCtrl'
    })
    .state('app.planestudios', {
      url: '/planestudios',
      templateUrl: 'views/planestudios/list.html',
      controller: 'PlanestudiosCtrl'
    })
    .state('app.planestudiodetalles', {
      url: '/planestudiodetalles/:id/detalles',
      templateUrl: 'views/planestudiodetalles/list.html',
      controller: 'PlanEstudioDetallesCtrl'
    })
    .state('app.matriculaingresanteconsolidadoporanio', {
      url: '/reporte/matricula/ingresante/consolidadoporanio',
      templateUrl: 'views/reports/matricula/ingresanteconsolidadoanio.html',
      controller: 'ReportsMatriculaIngresanteconsolidadoanioCtrl'
    })
    .state('app.matriculaingresanteconsolidadoporgenero', {
      url: '/reporte/matricula/ingresante/consolidadoporgenero',
      templateUrl: 'views/reports/matricula/ingresanteconsolidadogenero.html',
      controller: 'ReportsMatriculaIngresanteconsolidadogeneroCtrl'
    })
    .state('app.matriculaingresantesdetalle', {
      url: '/reporte/matricula/ingresante/detalle',
      templateUrl: 'views/reports/matricula/ingresantesdetalle.html',
      controller: 'ReportsMatriculaIngresantesdetalleCtrl'
    })
    .state('app.asignaraulas', {
      url: '/asignaraulas',
      templateUrl: 'views/asignaraulas/list.html',
      controller: 'AsignarAulasCtrl'
    })
    .state('app.inicio', {
      url: '/inicio',
      templateUrl: 'views/app_inicio.html',
      controller: 'AppInicioCtrl'
    });
  }).constant('TYPE_ALUMNO', {
    INGRESANTE: 'ING'
  }).constant('TYPE_GROUP', {
    ADMIN: 'ADMIN',
    ALUMNO: 'ALUMNO'
  }).run(function($rootScope) {
    $rootScope.inProgress = false;
    $rootScope.app = {
      name: 'Sistema de Matrícula',
      module:'',
      corporation: 'Universidad Nacional de Ucayali',
      developer: 'Edinson Nuñez More',
      isTest: true
    };
    $rootScope.errors = {
      required: 'Campo es requerido',
      email: 'Campo email inválido',
      validateUnique: 'Valor ya registrado'
    };
    $rootScope.Buttons = {
      Save: 'Guardar',
      Cancel: 'Cancelar',
      New: 'Nuevo'
    };
  })
  //take all whitespace out of string
    .filter('nospace', function () {
      return function (value) {
        return (!value) ? '' : value.replace(/ /g, '');
      };
    })
    .value('scDateTimeConfig', {
		    defaultTheme: 'material',
		    autosave: false,
		    defaultMode: 'date',
		    defaultDate: undefined, //should be date object!!
		    displayMode: undefined,
		    defaultOrientation: false,
		    displayTwentyfour: false,
		    compact: false
		})
    //replace uppercase to regular case
    .filter('humanizeDoc', function () {
      return function (doc) {
        if (!doc) return;
        if (doc.type === 'directive') {
          return doc.name.replace(/([A-Z])/g, function ($1) {
            return '-' + $1.toLowerCase();
          });
        }

        return doc.label || doc.name;
      };
    });

}).call(this);
