// Generated by CoffeeScript 1.9.3
(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name unuApp.controller:HorariosCtrl
   * @description
   * # HorariosCtrl
   * Controller of the unuApp
   */
  angular.module('unuApp')
    .controller('HorariosCtrl', function(
      $scope,
      MessageFactory,
      Restangular,
      $rootScope,
      $timeout,
      NgTableParams,
      $mdDialog
    ) {

      /**
       * variables iniciales
       */
      var service,
      serviceFacultad,
      servicePeriodo,
      serviceGrupoCurso,
      servicePlanestudios,
      serviceEscuela,
      serviceDocente,
      serviceAula,
      sevicePabellon,
      serviceProgramacionGrupoCurso;

      var docentes = [];
      var aulas = [];
      var pabellones = [];
      var LOCAL = {
        name: 'Horarios',
        form: 'views/horarios/form.html',
        horario_form : 'views/horarios/form-horario.html'
      };
      $scope.UI = {
        refresh: false,
        message: MessageFactory,
        title: 'Registro de Horarios para Cursos Aprobados',
        editMode: true,
        selected: null,
        customActions: []
      };
      $scope.current_menu = 'grupos';

      serviceProgramacionGrupoCurso = Restangular.all('programaciongrupocursos');

      /**
       * lista a todos los docentes
       */
      serviceDocente = Restangular.all('docentes');
      docentes = serviceDocente.getList();

      /**
       * lista todas las aulas
       */
      serviceAula = Restangular.all('aulas');
      aulas = serviceAula.getList();

      /**
       * lista los pabellones
       */
      sevicePabellon = Restangular.all('pabellones');
      pabellones = sevicePabellon.getList();

      /**
       * define el endpoint a usar
       */
      service = Restangular.all(LOCAL.route);
      $rootScope.app.module = ' > ' + LOCAL.name;

      $scope.showHorariosMenu = function(menu){
        $scope.current_menu = menu;
      };

      /**
       * obtienes los datos iniciales para el filtro
       */
      var LoadFacultades = function LoadFacultades() {
        serviceFacultad = Restangular.all('facultades');
        serviceFacultad.getList().then(function(data) {
          $scope.facultades = data;
        });
      };
      var LoadPeriodos = function LoadPeriodos() {
        servicePeriodo = Restangular.all('periodos');
        servicePeriodo.getList().then(function(data) {
          $scope.periodos = data;
        });
      };
      new LoadFacultades();
      new LoadPeriodos();

      /**
       * funciones llamadas en la vista
       */
      $scope.LoadEscuelas = function LoadEcuelas() {
        serviceEscuela = Restangular.all('escuelas');
        serviceEscuela.getList({
          conditions: {
            _facultad: $scope.filter._facultad._id
          }
        }).then(function(data) {
          $scope.escuelas = data;
        });
      };
      $scope.ListPlanEstudios = function ListPlanEstudios() {
        servicePlanestudios = Restangular.all('planestudios');
        servicePlanestudios.getList({
            conditions: {
              _escuela: $scope.filter._escuela._id
            }
          })
          .then(function(data) {
            $scope.planestudios = data;
          });
      };

      $scope.Refresh = function Refresh() {
        $scope.UI.selected = null;
        $scope.UI.editMode = false;
        $scope.tableParams.reload();
      };

      $scope.filter = {};

      $scope.currentHorario = function(group){
        if(!$scope.selected_horario){
          return true;
        }else{
          if(group.value.indexOf($scope.selected_horario._codigo_curso) >= 0){
            return true;
          }else{
            return false;
          }
        }
      };
      $scope.currentItemHorario = function(group){
        if(!$scope.selected_horario){
          return true;
        }else{
          if(group._codigo_curso === $scope.selected_horario._codigo_curso){
            return true;
          }else{
            return false;
          }
        }
      };

      /**
       * permite abrir las opciones múltiples al lado inferior derecho
       */
      $scope.EnabledAdd =function(item){
        $scope.UI.editMode = false;
        $scope.UI.selected = null;
        angular.forEach($scope.tableParams.data, function(element){
          angular.forEach(element.data, function(elem){
            if(item._id !== elem._id){
              elem.active = false;
            }
          });
        });

        if( item.active ){
          $scope.UI.editMode = true;
          $scope.UI.editModeHorario = false;
          $scope.UI.selected = item;
          $scope.selected_horario = item;
          $scope.UI.selected.route = LOCAL.route;
        }else{
          $scope.selected_horario = null;
        }
      };
      $scope.EnabledAddHorario =function(item){
        $scope.UI.editMode = false;
        $scope.UI.selected = null;
        angular.forEach($scope.tableParamsHorarios.data, function(element){
          angular.forEach(element.data, function(elem){
            if(item._id !== elem._id){
              elem.active = false;
            }
          });
        });

        if( item.active ){
          $scope.UI.editMode = false;
          $scope.UI.editModeHorario = true;
          $scope.UI.selected = item;
          $scope.UI.selected.route = LOCAL.route;
        }
      };

      /**
       * lista los cursos, se ejecuta en el ng-change de "Plan Estudios"
       */
      $scope.ListaCursosGrupos = function () {
        serviceGrupoCurso = Restangular.all('grupocursos');
        $scope.tableParams = new NgTableParams({
          page: 1,
          count: 1000,
          filter : {
            _planestudio : $scope.filter._planestudios._id
          }
        }, {
          total: 0,
          groupBy: function(dato){
            return dato._nombre_curso + '-' + dato._codigo_curso;
          },
          counts: [],
          getData: function($defer, params) {
            var query;
            query = params.url();
            $scope.UI.refresh = true;
            serviceGrupoCurso.customGET('methods/paginate', query).then(function(result) {
              $timeout(function() {
                $defer.resolve(result.data);
                $scope.UI.refresh = false;
              }, 500);
            });
          }
        });
        $scope.tableParamsHorarios = new NgTableParams({
          page: 1,
          count: 1000,
          filter : {
            _planestudio : $scope.filter._planestudios._id
          }
        }, {
          total: 0,
          groupBy: function(dato){
            return dato._nombre_curso + '-' + dato._codigo_curso + '-' + dato._grupo_curso;
          },
          counts: [],
          getData: function($defer, params) {
            var query;
            query = params.url();
            $scope.UI.refresh = true;
            serviceProgramacionGrupoCurso.customGET('methods/paginate/filter', query).then(function(result) {
              $timeout(function() {
                $defer.resolve(result.data);
                $scope.UI.refresh = false;
              }, 500);
            });
          }
        });
      };

      /**
       * Abre modal para crear los horarios
       */
      $scope.New = function ($event){
        var parentEl = angular.element(document.body);
        var groupCurso = Restangular.copy($scope.UI.selected);
        $mdDialog.show({
          parent: parentEl,
          targetEvent: $event,
          templateUrl :LOCAL.form,
          locals:{
            name : LOCAL.name,
            table : $scope.tableParams,
            tableHorarios : $scope.tableParamsHorarios,
            groupCurso : groupCurso,
            aulas : aulas,
            pabellones : pabellones,
            docentes : docentes,
            serviceProgramacionGrupoCurso: serviceProgramacionGrupoCurso
          },
          controller : 'CursoHorarioCtrl'
        });
      };
      $scope.NewHorario = function ($event){
        var parentEl = angular.element(document.body);
        var horarioCurso = Restangular.copy($scope.UI.selected);
        $mdDialog.show({
          parent: parentEl,
          targetEvent: $event,
          templateUrl : LOCAL.horario_form,
          locals:{
            name : LOCAL.name,
            table : $scope.tableParamsHorarios,
            horarioCurso : horarioCurso
          },
          controller : 'CursoHorarioFechaCtrl'
        });
      };

    })

    /**
     * controlador para agregar nuevo horario
     */
    .controller('CursoHorarioCtrl', function(
      $scope,
      table,
      tableHorarios,
      name,
      MessageFactory,
      ToastMD,
      $mdDialog,
      aulas,
      pabellones,
      docentes,
      groupCurso,
      serviceProgramacionGrupoCurso
    ){

      /**
       * parámetros iniciales
       */
      $scope.includeActive = false;
      $scope.submited = false;
      $scope.title = MessageFactory.Form.New.replace('{element}',name);
      $scope.Buttons = MessageFactory.Buttons;
      $scope.message = MessageFactory.Form;
      $scope.model = {};
      $scope.modalidadCurso = ['Teoria', 'Practica', 'Seminario', 'Laboratorio', 'Otros'];
      $scope.modalidadDocente = ['Titular', 'Auxiliar', 'Otro'];
      $scope.aulas = aulas;
      $scope.pabellones = pabellones;
      $scope.docentes = docentes;

      $scope.model.codigo = groupCurso._codigo_curso;
      $scope.model.curso = groupCurso._nombre_curso;

      /**
       * registra el horario
       */
      $scope.Save = function(form) {
        $scope.submited = true;
        if (form.$valid) {
          var horario = {
            _grupoCurso : groupCurso._id,
            _aula : $scope.model.aula._id,
            _docente : $scope.model.docente._id,
            modalidadClaseGrupo : $scope.model.modalidad_curso,
            modalidadDocente : $scope.model.modalidad_docente,
            horarios : []
          };
          serviceProgramacionGrupoCurso.post(horario).then(function() {
            ToastMD.success(MessageFactory.Form.Saved);
            $mdDialog.hide();
            table.reload();
            tableHorarios.reload();
          });
        }
      };
      $scope.Cancel = function(){
        $mdDialog.hide();
      };
    })

    /**
     * controlador para agregar fechas al horario
     */
    .controller('CursoHorarioFechaCtrl', function(
      $scope,
      table,
      name,
      MessageFactory,
      ToastMD,
      $mdDialog,
      horarioCurso
    ){

      /**
       * parámetros iniciales
       */
      $scope.includeActive = false;
      $scope.submited = false;
      $scope.title = MessageFactory.Form.New.replace('{element}',name);
      $scope.Buttons = MessageFactory.Buttons;
      $scope.message = MessageFactory.Form;
      $scope.model = {};
      $scope.horario = horarioCurso;
      $scope.dias = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];

      /**
       * registra el horario
       */
      $scope.Save = function(form) {
        $scope.horario.route = 'programaciongrupocursos';
        $scope.horario.horarios.push({
          dia : $scope.model.dia,
          horaInicio : $scope.model.horaInicio,
          horaFin : $scope.model.horaFin
        });
        $scope.submited = true;
        if (form.$valid) {
          $scope.horario.put().then(function() {
            ToastMD.success(MessageFactory.Form.Updated);
            $mdDialog.hide();
            table.reload();
          });
        }
      };
      $scope.Cancel = function(){
        $mdDialog.hide();
      };
    });

}).call(this);
