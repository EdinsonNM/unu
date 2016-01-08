// Generated by CoffeeScript 1.9.3
(function() {
  'use strict';

  /**
    * @ngdoc service
    * @name unuApp.UserFactory
    * @description
    * # UserFactory
    * Service in the unuApp.
   */
  angular.module('unuApp').factory('MessageFactory', [function() {
    return {
      Buttons:{
        Add: 'Agregar',
        New: 'Nuevo',
        Edit: 'Editar',
        Delete: 'Eliminar',
        Save: 'Guardar',
        Cancel:'Cancelar',
        Yes:'Si',
        No:'No'
      },
      Form:{
        New:'Agregar {element}',
        Edit: 'Editar {element}',
        Delete: 'Eliminar {element}',
        Saved:'Registro satisfactorio',
        Updated:'Actualización satisfactoria',
        Deleted:'Se quito el elemento',
        QuestionDelete:'¿Desea eliminar el elemento seleccionado?',
        Required:'Campo es requerido',
        validateUnique:'Valor ya se encuentra registrado'
      }
    };
  }]);

}).call(this);