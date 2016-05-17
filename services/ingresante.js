'use strict';
var Ingresante = require( '../models/IngresanteModel.js');
var Facultad = require( '../models/FacultadModel.js');
var Escuela = require( '../models/EscuelaModel.js');
var MessageResponse = require( '../commons/libs/responses/responses');
class IngresanteService{
	static listByFacultad(req,res){
		console.log(req.query)
		let _facultad = req.query._facultad;
		let _escuela = req.query._escuela;
		let _periodo = req.query._periodo;
		if(_facultad){
			if(_escuela){
				Ingresante
				.find({_escuela:_escuela,_periodo:_periodo})
				.populate('_persona')
				.populate('_periodo')
				.populate({path:'_escuela',populate:{path:'_facultad',model:'Facultad'}}).exec((error,data)=>{
					if(error) return MessageResponse.InternalError(res,error);
					return MessageResponse.OK(res,data);
				});
			}else{
				Escuela.find({_facultad:_facultad},(error,escuelas)=>{
					if(error) return MessageResponse.InternalError(res,error);
					var escuelasId = [];
					escuelas.forEach((item)=>{
						escuelasId.push(item._id);
					});
					Ingresante
					.find({_escuela:{$in:escuelasId},_periodo:_periodo})
					.populate('_persona')
					.populate('_periodo')
					.populate({path:'_escuela',populate:{path:'_facultad',model:'Facultad'}}).exec((error,data)=>{
						if(error) return MessageResponse.InternalError(res,error);
						return MessageResponse.OK(res,data);
					});
				});
			}
		}else{
			return MessageResponse.BadRequest(res,'Facultad es requerido');
		}
	}
}

module.exports = IngresanteService;