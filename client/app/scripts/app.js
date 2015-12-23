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
    'ngMaterial'
  ]).config(function($stateProvider, $urlRouterProvider, RestangularProvider, $httpProvider) {
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
        DataResolve: function(UserFactory, $q, $rootScope, TYPE_GROUP) {
          var deferred;
          deferred = $q.defer();
          UserFactory.getUser().then(function(result) {
            $rootScope.USER = result.user;
            switch ($rootScope.USER._grupo.codigo) {
              case TYPE_GROUP.MIC:
                $rootScope.app.name = 'M. Investigación Científica';
                break;
              default:
                $rootScope.app.name = 'Sistema de Matrícula';
            }
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
    .state('app.alumnos', {
    url: '/alumnos',
    templateUrl: 'views/alumnos/list.html',
    controller: 'AlumnosCtrl'
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
    })
    .state('app.mic_asignaturas', {
      url: '/mic/asignaturas',
      templateUrl: 'views/mic/asignaturas/list.html',
      controller: 'MICAsignaturasCtrl'
    })
    .state('app.mic_revisionplanestudios', {
      url: '/mic/revision-planestudios',
      templateUrl: 'views/mic/planestudios/list.html',
      controller: 'MICRevisionPlanEstudiosCtrl'
    })
    .state('app.mic_silabus', {
      url: '/mic/silabus',
      templateUrl: 'views/mic/silabus/list.html',
      controller: 'MICSilabusCtrl'
    })
    .state('app.mic_silabus_detalle', {
      url: '/mic/silabus/:id',
      templateUrl: 'views/mic/silabus/form.html',
      controller: 'MICSilabusDetalleCtrl'
    })
    .state('app.mic_revisionsilabus', {
      url: '/mic/revision-silabus',
      templateUrl: 'views/mic/revisionsilabus/list.html',
      controller: 'MICRevisionSilabusCtrl'
    })
    .state('app.sesionaprendizaje', {
      url: '/mic/sesionaprendizaje',
      templateUrl: 'views/mic/sesionaprendizaje/list.html',
      controller: 'MICSesionAprendizajeCtrl'
    })
    .state('app.mic_sesionaprendizaje_detalle', {
      url: '/mic/sesionaprendizaje/:id',
      templateUrl: 'views/mic/sesionaprendizaje/form.html',
      controller: 'MICSesionaprendizajeDetalleCtrl'
    });
  }).constant('TYPE_ALUMNO', {
    INGRESANTE: 'ING'
  }).constant('TYPE_GROUP', {
    ADMIN: 'ADMIN',
    ALUMNO: 'ALUMNO',
    MIC: 'MIC'
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
