//_app.js
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
      'ngMaterialDatePicker',
      'ngFileUpload',
      'angular.filter'
    ]).config(['$stateProvider', '$urlRouterProvider', 'RestangularProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, RestangularProvider, $httpProvider) {
      RestangularProvider.setBaseUrl('/api');
      $httpProvider.interceptors.push('AuthInterceptor');
      RestangularProvider.setRestangularFields({
        id: '_id'
      });
      $urlRouterProvider.otherwise('/');


      var ResolveSessionController = function(UserFactory, $q, $rootScope, TYPE_GROUP) {
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
        }, function(result) {
          console.log(result);
          deferred.resolve(false);
        });
        return deferred.promise;
      };
      ResolveSessionController.$inject = ['UserFactory', '$q', '$rootScope', 'TYPE_GROUP'];

      var GetAlumno =  function(UserFactory, $q, $rootScope,$state, ToastMD) {
        var defer = $q.defer();
        UserFactory.getAlumno().then(function(data){
          $rootScope.ALUMNO = data;
          defer.resolve(data);
        },function(err){
          ToastMD.error(err.data.message);
          defer.reject(err);
          $state.go('app');
        });
        return defer.promise;
      };
      GetAlumno.$inject = ['UserFactory', '$q', '$rootScope','$state','ToastMD'];

      var GetPeriodoActivo =  function(UserFactory, Restangular, $q, $rootScope,$state, ToastMD) {
        var defer = $q.defer();
        var servicePeriodo = Restangular.all('periodos');
        servicePeriodo.customGET('/lastPeriodo').then(function(data) {
          defer.resolve(data);
        },function(err){
          ToastMD.error(err.data.message);
          defer.reject(err);
          $state.go('app');
        });
        return defer.promise;
      };
      GetPeriodoActivo.$inject = ['UserFactory','Restangular', '$q', '$rootScope','$state','ToastMD'];

      $stateProvider.state('app', {
          url: '/home',
          views: {
            '@': {
              templateUrl: 'views/app.html',
              controller: 'AppCtrl as vm'
            }
          },
          resolve: {
            DataResolve: ResolveSessionController
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
        .state('getcode', {
          url: '/getCode',
          templateUrl: 'views/getcode.html',
          controller: 'GetCodeCtrl'
        })
        .state('recoverpass', {
          url: '/recoverPass',
          templateUrl: 'views/recoverpass.html',
          controller: 'RecoverPassCtrl'
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
        .state('app.ingresantes', {
          url: '/ingresantes',
          templateUrl: 'views/ingresantes/list.html',
          controller: 'IngresantesCtrl'
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
        .state('app.matricula', {
          url: '/matricula',
          templateUrl: 'views/matricula/index.html',
          controller: 'MatriculaCtrl'
        })
        .state('app.planestudios', {
          url: '/planestudios',
          templateUrl: 'views/planestudios/list.html',
          controller: 'PlanestudiosCtrl'
        })

      .state('app.planestudiosequivalencia', {
          url: '/planestudios/equivalencia',
          templateUrl: 'views/equivalencias/list.html',
          controller: 'EquivalenciasPlanEstudioCtrl'
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
        .state('app.pagosingresantes', {
          url: '/pagosingresantes',
          templateUrl: 'views/ingresantes/pagos.html',
          controller: 'PagosIngresantesCtrl'
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
        .state('app.aprobacionplanestudios', {
          url: '/aprobacion/planestudios',
          templateUrl: 'views/aprobacion/planestudios/list.html',
          controller: 'AprobacionPlanestudiosCtrl'
        })
        .state('app.aprobacionplanestudiosdetalle', {
          url: '/aprobacion/planestudios/:id',
          templateUrl: 'views/aprobacion/planestudios/list-detalle.html',
          controller: 'AprobacionPlanestudiosDetalleCtrl'
        })
        .state('app.aprobacioncursosperiodo', {
          url: '/aprobacion/cursos',
          templateUrl: 'views/aprobacion/cursos/list.html',
          controller: 'AprobacionCursosPeriodoCtrl'
        })
        .state('app.aprobacioncursosperiododetalle', {
          url: '/aprobacion/cursos/:id',
          templateUrl: 'views/aprobacion/cursos/list-detalle.html',
          controller: 'AprobacionCursosPeriodoDetalleCtrl'
        })
        .state('app.grupocursoperiodo', {
          url: '/aprobacion/grupocurso',
          templateUrl: 'views/aprobacion/cursos/list-grupo.html',
          controller: 'CursoGrupoCrtl'
        })
        .state('app.alumnomisdatos', {
          url: '/alumno/misdatos',
          templateUrl: 'views/alumno/misdatos.html',
          controller: 'AlumnoMisDatosCtrl',
          resolve:{
            ALUMNO:GetAlumno,
          }
        })
        .state('app.alumnocambiocontrasenia', {
          url: '/alumno/cambiocontrasenia',
          templateUrl: 'views/alumno/cambiocontrasenia.html',
          controller: 'AlumnoCambioContraseniaCtrl'
        })
        .state('app.alumnoplandeestudios', {
          url: '/alumno/planestudios',
          templateUrl: 'views/alumno/planestudios.html',
          controller: 'AlumnoPlanestudiosCtrl'
        })
        .state('app.paramprocesosperiodo', {
          url: '/periodo-parametros-procesos',
          templateUrl: 'views/periodos/params-procesos.html',
          controller: 'PeriodoParametrosProcesosCtrl'
        })
        .state('app.paramprocesosescuela', {
          url: '/escuela-parametros-procesos',
          templateUrl: 'views/escuelas/params-procesos.html',
          controller: 'EscuelaParametrosProcesosCtrl'
        })
        .state('app.procesosfacultad', {
          url: '/facultad-procesos',
          templateUrl: 'views/facultades/procesos.html',
          controller: 'FacultadProcesosCtrl'
        })
        .state('app.parametros', {
          url: '/parametros',
          templateUrl: 'views/parametros/list.html',
          controller: 'ParametrosCtrl'
        })
        .state('app.procesos', {
          url: '/procesos',
          templateUrl: 'views/procesos/list.html',
          controller: 'ProcesosCtrl'
        })
        .state('app.aprobacioningresantes', {
          url: '/aprobacion/ingresantes',
          templateUrl: 'views/aprobacion/ingresantes/list.html',
          controller: 'AprobacionIngresanteCtrl'
        })
        .state('app.conflicto', {
          url: '/conflictos',
          templateUrl: 'views/conflictos/list.html',
          controller: 'ConflictosCtrl'
        })
        .state('app.conflictosalumno', {
          url: '/conflictosalumnos',
          templateUrl: 'views/conflictosalumnos/list.html',
          controller: 'ConflictosalumnoCtrl'
        })
        .state('app.archivossalida', {
          url: '/archivos-salida',
          templateUrl: 'views/archivosbanco/list.html',
          controller: 'ArchivosBancoSalidaCtrl'
        })
        .state('app.archivosentrada', {
          url: '/archivos-entrada',
          templateUrl: 'views/archivosentrada/list.html',
          controller: 'ArchivosBancoEntradaCtrl'
        })
        .state('app.otrasdeudasalumnos', {
          url: '/otrasdeudasalumnos',
          templateUrl: 'views/otrasdeudasalumnos/list.html',
          controller: 'OtrasDeudasAlumnosCtrl'
        })
        .state('app.secciones', {
          url: '/secciones',
          templateUrl: 'views/secciones/list.html',
          controller: 'SeccionesCtrl'
        })
        .state('app.horarios', {
          url: '/horarios',
          templateUrl: 'views/horarios/index.html',
          controller: 'HorariosCtrl'
        })
        .state('app.matricularevision', {
          url: '/testing/matricula/revision',
          templateUrl: 'views/matricula/revision.html',
          controller: 'MatriculaRevisionCtrl',
          resolve:{
            ALUMNO:GetAlumno,
            PERIODO:GetPeriodoActivo/*,
            procesos:GetProcesos,
            accesoUI:ValidadAccesoUI*/

          }
        })
        .state('app.matriculainscripcion', {
          url: '/matricula/inscripcion',
          templateUrl: 'views/matricula/inscripcion.html',
          controller: 'MatriculaInscripcionCtrl',
          resolve:{
            ALUMNO:GetAlumno,
            PERIODO:GetPeriodoActivo
          }
        })

      .state('app.matriculacursos', {
        url: '/testing/matricula/cursos',
        templateUrl: 'views/matricula/cursos.html',
        controller: 'MatriculaCursosCtrl'
      })

      .state('app.matricularevisionlast', {
        url: '/testing/matricula/revisionlast',
        templateUrl: 'views/matricula/revision-last.html',
        controller: 'MatriculaRevisionLastCtrl'
      })

      .state('app.matriculaingresantelast',{
         url:'testing/matricula/ingresantesmatricula',
         templateUrl: 'views/matricula/ingresantes-last.html',
         controller: 'MatriculaRevisionLastCtrl'
      })

      //inicio mic
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
        })
        .state('app.compromisopagos', {
          url: '/compromisopagos',
          templateUrl: 'views/compromisopagos/list.html',
          controller: 'CompromisoPagoCtrl'
        })
        .state('app.reportegrupocursos', {
          url: '/reportes/grupocursos',
          templateUrl: 'views/reportes/grupocursos.html',
          controller: 'RptCursoGrupoCrtl'
        })
        .state('app.reporteingresantefacultad', {
          url: '/reportes/ingresantes/facultad',
          templateUrl: 'views/reportes/ingresantes/ingresantes_facultad.html',
          controller: 'RptIngresantesFacultadCrtl'
        })
        .state('app.reportematriculadosfacultad', {
          url: '/reportes/alumnos/matriculados/facultad',
          templateUrl: 'views/reportes/alumnos/matriculados_facultad.html',
          controller: 'RptMatriculadosFacultadCrtl'
        });
    }]).constant('TYPE_ALUMNO', {
      INGRESANTE: 'ING'
    }).constant('TYPE_GROUP', {
      ADMIN: 'ADMIN',
      ALUMNO: 'ALUMNO',
      DOCENTE: 'DOCENTE',
      MIC: 'MIC'
    })
    .constant('PROCESO_MATRICULA', {
      REGULAR: '09',
      EXTEMPORANEO: '24',
      INGRESANTE: '23'
    })
    //take all whitespace out of string
    .filter('nospace', function() {
      return function(value) {
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
    .filter('humanizeDoc', function() {
      return function(doc) {
        if (!doc) return;
        if (doc.type === 'directive') {
          return doc.name.replace(/([A-Z])/g, function($1) {
            return '-' + $1.toLowerCase();
          });
        }

        return doc.label || doc.name;
      };
    })
    //saca la fecha del sistema
    .filter('currentdate', ['$filter', function($filter) {
      return function() {
        return $filter('date')(new Date(), 'dd-MM-yyyy');
      };
    }]);


}).call(this);
