'use strict';
const MESSAGES={
	INTERNAL_ERROR: 'Ocurrio un error interno del servidor'
}

class MessageResponse{
	static InternalError(response,error){
		return response.status(500).send({
			message:MESSAGES.INTERNAL_ERROR,
			detail:error
		});
	}
	static NotFound(response,message){
		return response.status(404).send({message:message});
	}
	static BadRequest(response,message){
		return response.status(400).send({message:message});
	}
}

module.exports = MessageResponse;