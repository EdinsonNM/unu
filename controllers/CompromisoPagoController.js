var procExport = require('../commons/libs/compromisopago/procesoSalidaBanco');
var procesoPago = require('../commons/libs/compromisopago/procesoEntradaBanco');
var model = require('../models/CompromisoPagoModel.js');
var Persona = require('../models/PersonaModel.js');

var auth = require('../config/passport');
var path = require('path');
var CompromisoPagoAlumno = require('../commons/libs/compromisopago/compromisopagoalumno');
var NuevosCompromisos = require('../unicostmp/recalculo-compromisos.js');
//var CompromisoPago = require('../commons/libs/compromisopago/compromisopago');

var generarIngresantes = require('../commons/generarAlumnos');
module.exports=function(){
  var baucis=require('baucis');
  return{
    setup:function(){

      var controller=baucis.rest('CompromisoPago');
      controller.fragment('/compromisopagos');

      //custom methods
      controller.post('/methods/process',function(req,res){
        var type = req.params.type;
        procExport(function(err,result){
          if(err){ return res.status(500).send(err);}
          var nomArchivo = result.nombre;
          pathFile = path.join(__dirname, '../', 'commons/data/exports', nomArchivo);
          res.download(pathFile);
        });
      });

      controller.post('/methods/registropago/:id',function(req,res){
        procesoPago.procesarPagoIndividual(req.params.id,req.body.monto,req.body.fecha,function(err,data){
          if(err) return res.status(err.status).send({message:err.message,detail:err.error});
          return res.status(200).send(data);
        });
      });

      /*controller.post('/methods/generar/:tipo',function(req,res){
        var periodo = req.body._periodo;
        var tipo = req.params.tipo;
        var compromiso = new CompromisoPago(periodo,tipo);
        compromiso.generar(function(err,data){
          if(err) return res.status(err.status).send(err);
          return res.status(201).send(data);
        });

      });*/

      controller.get('/methods/deudas', function(req, res) {
        var limit = parseInt(req.query.count);
        var page = parseInt(req.query.page) || 1;
        var filter = req.query.filter;
        model.paginate(
          filter, {
            page: page,
            limit: limit,
            populate:[
               {
                  path:'_persona',
                  populate: {
                     path: '_alumno',
                     model:"Alumno"
                  }
               },
               {
                  path:'_tasa'
               }
            ]
          },

          function(err, results, pageCount, itemCount) {
            var obj = {
              total: results.total,
              perpage: limit*1,
              current_page: page*1,
              last_page: results.pages,
              from: (page-1)*limit+1,
              to: page*limit,
              data: results.docs
            };
            res.send(obj);
          }
        );
      });

      controller.post('/methods/generar/matricula/:id',function(req,res){
        var matriculaId = req.params.id;
        var compromiso = new CompromisoPagoAlumno(matriculaId);
        compromiso.generar(function(err,data){
            if(err) return res.status(err.status).send(err);
            return res.status(201).send(data);
        });

      });

      controller.post('/methods/generar/ingresantes',function(req,res){
        generarIngresantes();
        return res.status(200).send('Proceso en ejecución');

      });

      controller.post('/methods/recalculo-compromisos',function(req,res){
        NuevosCompromisos();
        return res.status(201).send("ok");
      });

      controller.get('/methods/paginate', function(req, res){
      	var limit = parseInt(req.query.count);
      	var page = parseInt(req.query.page) || 1;
      	var filter = req.query.filter;
        var filterPersona={};
        for (var key in filter) {
          switch (key) {
            case 'codigo':
              filter[key] = new RegExp(filter[key],'i');
              break;
            case 'nombres':
            case 'apellidoPaterno':
            case 'apellidoMaterno':
              filterPersona[key] = new RegExp(filter[key],'i');
              delete filter[key];
              break;
          }
        }
        var ids=[];
        Persona
        .find(filterPersona)
        .select('_id')
        .exec(function(err,data){
          data.forEach(function(item){
            ids.push(item._id);
          });
          if(filterPersona)
            if(filter)
              filter._persona = {$in:ids};
        	model.paginate(
        		filter,
        		{page: page, limit: limit,populate:'_persona'},
        		function(err, results, pageCount, itemCount){

              var obj = {
                total: results.total,
                perpage: limit*1,
                current_page: page*1,
                last_page: results.pages,
                from: (page-1)*limit+1,
                to: page*limit,
                data: results.docs
              };
        			res.send(obj);
        		}
        	);
        });

      });
    }
  };
};
