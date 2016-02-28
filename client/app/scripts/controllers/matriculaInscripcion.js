// Generated by CoffeeScript 1.9.3
(function() {
  'use strict';

  /**
    * @ngdoc function
    * @name unuApp.controller:FacultadesCtrl
    * @description
    * # FacultadesCtrl
    * Controller of the unuApp
   */

  angular.module('unuApp')
    .controller('MatriculaInscripcionCtrl', function(
      MessageFactory,
      $rootScope,
      $scope,
      Restangular,
      $mdDialog,
      $timeout,
      ToastMD,
      $mdMedia
    ) {

      /**
       * initial Params
       */
      $timeout(function(){
        $scope.ALUMNO = $rootScope.ALUMNO;
        $scope.ALUMNO.imagen = 'https://scontent-mia1-1.xx.fbcdn.net/hprofile-xat1/v/t1.0-1/p40x40/11223699_10153156042805197_7314257029696994522_n.jpg?oh=e7bb5941596bf09f6912f9e557017e7b&oe=5768BB8B';
      }, 500);
      $scope.UI = {
        refresh: false,
        message: MessageFactory,
        title: 'Matrícula 2016-I',
        editMode: false,
        selected:null,
        customActions:[]
      };
      var LOCAL ={
        name: 'Matrícula',
        name_form : 'Seleccion un curso para ser agregado a su matrícula',
        form:'views/matricula/inscripcion-form.html',
        route:'facultades'
      };
      $scope.cursos_selected = [];

      /**
       * Abre modal para agregar cursos
       */
       $scope.New = function New($event){
         var useFullscreen = ($mdMedia('sm') || $mdMedia('xs')) && $mdMedia('xs') || $mdMedia('sm');
         var parentEl = angular.element(document.body);
         $mdDialog.show({
           parent: parentEl,
           targetEvent: $event,
           templateUrl: LOCAL.form,
           locals:{
             name_form: LOCAL.name_form,
             alumno: $scope.ALUMNO
           },
           controller: 'InscripcionNewCtrl',
           fullscreen: useFullscreen
         });
       };

    })

    /**
     * controler de modal de cursos para agregar a la matrícula
     */
    .controller('InscripcionNewCtrl', function(
      $scope,
      Restangular,
      MessageFactory,
      alumno,
      NgTableParams,
      $timeout
    ){

      /**
       * initial params
       */
      var serviceCursos;
      $scope.includeActive = false;
      $scope.submited = false;
      $scope.title = MessageFactory.Form.New.replace('{element}', name);
      $scope.Buttons = MessageFactory.Buttons;
      $scope.message = MessageFactory.Form;
      $scope.model = {};
      $scope.ALUMNO = alumno;
      console.log(alumno);

      serviceCursos = Restangular.all('planestudiodetalles');

      var ListDetallePlanEstudios = function(id_periodo, id_planestudio) {
        if(id_planestudio === 0 || id_periodo === 0){
          return;
        }
        $scope.tableParams = new NgTableParams({
          page: 1,
          count: 1000,
          filter: {
              _planestudio: id_planestudio
          }
        }, {
          total: 0,
          groupBy: 'ciclo',
          counts: [],
          getData: function($defer, params) {
            var query;
            query = params.url();

            serviceCursos.customGET('methods/aprobacion/' + id_periodo, query).then(function(result) {
              $timeout(function() {
                params.total(result.total);
                $defer.resolve(result.data);
              }, 500);
            });
          }
        });
      };
      ListDetallePlanEstudios('56c2ce19f484a8c740091645', '56c2ce1af484a8c740091700');

    });

}).call(this);