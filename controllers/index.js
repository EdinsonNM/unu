var fs = require('fs');
var path = require('path');
module.exports.bootstrap=function bootstrap(){
	var file;
	var controllers = fs.readdirSync(__dirname);
	module.exports.controllers=[];
	for (var i = 0; i < controllers.length; i++) {
		file = controllers[i];
		controllerName = file.split('.')[0];
		if(controllerName!='index'){
			module.exports.controllers[i] = require('./'+controllerName);
		}

	}
};
