// Generated by CoffeeScript 1.9.3
(function() {
  'use strict';

  /**
    * @ngdoc service
    * @name unuApp.AuthTokenFactory
    * @description
    * # AuthTokenFactory
    * Service in the unuApp.
   */
  angular.module('unuApp').service('AuthTokenFactory', ['$window',function($window) {
    var key, store;
    store = $window.localStorage;
    key = 'auth-token';
    return {
      getToken: function() {
        return store.getItem(key);
      },
      setToken: function(token) {
        if (token) {
          store.setItem(key, token);
        } else {
          store.removeItem(key);
        }
      }
    };
  }]);

}).call(this);
