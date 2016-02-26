var process = require('../commons/libs/compromisopago/procesoEntradaBanco');
var path = require('path');
var watch = require('node-watch');
var EVENT_CHANGE = 'change';
module.exports.watchBanco  = function(folder){
  watch(folder,{}, function (  filename ) {
      var datafile= filename.split('.');
      if(datafile.pop()!='lock'){
        console.log("something changed in watched directory", filename,'\n' );
    		process(filename,function ( error, data ) {
    			if (error) {
    				console.log(error);
    			}
    		});
      }

  });
};
