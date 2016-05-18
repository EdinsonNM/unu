'use strict';
var Alumno = require( '../models/AlumnoModel.js');
var Facultad = require( '../models/FacultadModel.js');
var Escuela = require( '../models/EscuelaModel.js');
var Matricula = require( '../models/MatriculaModel.js');
var MessageResponse = require( '../commons/libs/responses/responses');

class AlumnoService{
	static listMatriculadosByFacultad(req,res){
		let _facultad = req.query._facultad;
		let _escuela = req.query._escuela;
		let _periodo = req.query._periodo;

		var queryFn = (queryEscuela,req,res)=>{
			Alumno.find(queryEscuela).exec((error,alumnos)=>{
				if(error) return MessageResponse.InternalError(res,error);
				var alumnosId = [];
				alumnos.forEach((item)=>{
					alumnosId.push(item._id);
				});
				Matricula.find({_alumno:{$in:alumnosId},_periodo:_periodo})
				.populate({
					path:'_alumno',
					populate:[
						{
							path:'_escuela',
							model:'Escuela',
							populate:{
								path:'_facultad',
								model:'Facultad'
							}
						},
						{
							path:'_persona',
							model:'Persona'
						}
					]
				})
				.exec((error,data)=>{
					if(error) return MessageResponse.InternalError(res,error);
					return MessageResponse.OK(res,data);
				});
			});
		}
		if(_facultad){
			if(_escuela){
				let queryEscuela = {_escuela:_escuela};
				queryFn(queryEscuela,req,res);
			}else{
				Escuela.find({_facultad:_facultad}).exec((error,escuelas)=>{
					if(error) return MessageResponse.InternalError(res,error);
					var escuelasId = [];
					escuelas.forEach((item)=>{
						escuelasId.push(item._id);
					});
					var queryEscuela = {_escuela:{$in:_escuela}};
					queryFn(queryEscuela,req,res);
				});
			}
			
		}else{
			return MessageResponse.BadRequest(res,'Facultad es requerido');
		}
	}
}
module.exports = AlumnoService;