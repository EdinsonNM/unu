var controller = require('../controllers');
var fs = require('fs');
module.exports=function(){
	var controllerFn;
	controller.bootstrap();
	var file;
	var controllers = fs.readdirSync("./controllers");
	for (var i = 0; i < controllers.length; i++) {
		file = controllers[i];
		controllerName = file.split('.')[0];
		if(controllerName!='index')
			controller.controllers[i]().setup();

	}

};
