var ArchivoSalidaBanco = require('../models/ArchivoSalidaBancoModel.js');//model de archivo
var fs = require('fs'); //permite escribir y leer en disco

var RegistroPagoTodos = function RegistroPagoTodos(){

};
var RegistroPagoAlumnos = function RegistroPagoAlumnos(){

};
var RegistroPagoIngresantes = function RegistroPagoIngresantes(periodo,next){
    //if(error) return next(error);
    //return next(null,archivo);
};

module.exports = {
  Todos: RegistroPagoTodos,
  Alumnos: RegistroPagoAlumnos,
  Ingresantes: RegistroPagoIngresantes
};
