var utils = require('./compromisopago.utils');
var ArchivoBanco = require('../../../models/ArchivoBancoModel.js'); //model de archivo
var Persona = require('../../../models/PersonaModel.js'); //model de persona
var CompromisoPago = require('../../../models/CompromisoPagoModel.js'); //model de persona
var Tasa = require('../../../models/TasaModel.js'); //model de persona
var fs = require('fs'); //permite escribir y leer en disco
var path = require('path');
var Q = require('q');
var generarCabecera  = function GenerarCabacera(numVersion,fecha){
  var version = utils.pad(numVersion.toString(),3,'0');
  var linea = '';
  linea = '01'; //Indicador de cabecera 01 (*)
  linea = linea + '20154598244'; //RUC DE LA UNIVERSIDAD
  linea = linea + '556'; //Número proporcionado por el banco
  linea = linea + 'PEN'; //Moneda
  linea = linea + fecha; //Fecha de Facturación
  linea = linea + version; //Versión
  linea = linea + utils.pad('',7,' '); //Vacio
  linea = linea + 'T'; //Tipo de Actualización
  linea = linea + utils.pad('',322,' ');//vacio
  return linea;
};
module.exports = function GenerarArchivoSalida(next) {

  dataArchivo = "";
  linea = "";
  TotalRegistros = 0;
  TotalMaximo = 0;
  TotalMinimo = 0;
  version = 0;
  vacios = utils.pad('', 80, ' ');
  var nomArchivo = "";
  pathFile = "";
  var temp = [];

  //Cabecera
  var fecha = new Date().toISOString().replace('T', ' ').substr(0, 19);
  fecha = fecha.replace(/-/g, '').replace(/:/g, '').replace(/ /g, '').substr(0, 8);
  temp.nombre = "/" + fecha + "/";
  ArchivoBanco.count(temp, function(err, num) {
    if (err) {
      return next(err);
    }
    linea = generarCabecera(num,fecha);
    dataArchivo = linea + '\r\n';
    //Detalle
    CompromisoPago.find({
      pagado: false,
      estado:'Activo'
    }).populate('_persona _tasa').exec(function(err, items) {

      if (err) {
        return next(err);
      } else {
        items.forEach(function(itemtabla) {
          //linea=NuevaLineaArchivo(itemtabla);
          linea = "";
          cadtemp = "";
          numtemp = 0;

          linea = linea + '02'; //Tipo de Registro
          cadtemp = utils.RemplazaCaracteres(itemtabla._persona.apellidoPaterno + ' ' + itemtabla._persona.apellidoMaterno + ' ' + itemtabla._persona.nombres ) + vacios.substr(0, 30);
          linea = linea + cadtemp.replace(/-/g, ' ').substr(0, 30); //Nombre del Cliente
          cadtemp = itemtabla.codigo + utils.pad(utils.RemplazaCaracteres(itemtabla._tasa.abreviatura),14,' ')  + itemtabla._id.toString();
          linea = linea + cadtemp; //Campo de Identificación del Pago
          linea = linea + (itemtabla.fechavenc.getFullYear() * 10000 + (itemtabla.fechavenc.getMonth() + 1) * 100 + itemtabla.fechavenc.getDate()); // Fecha de Vencimiento
          linea = linea + "20301231"; // Fecha de Bloqueo sugerido por el banco.
          linea = linea + '00'; //  Período del pago Facturado
          numtemp = itemtabla.saldo * 100 + 1000000000000000;

          linea = linea + numtemp.toString().substr(-15); //Importe Maximo a cobrar
          linea = linea + numtemp.toString().substr(-15); // Importe Minimo a cobrar  - Se debe consultar cuanto será el mínimo pero el modelo considera pagos parciales.
          linea = linea + utils.pad('',32,'0'); // Información Adicional - Uso exclusivo del banco se rella de ceros
          linea = linea + '00'; // Cod. De Sub concepto 01
          linea = linea + utils.pad('',14,'0'); // Valor de Sub Concepto 01
          linea = linea + '00'; // Cod. De Sub concepto 02
          linea = linea + utils.pad('',14,'0'); // Valor de Sub Concepto 02
          linea = linea + '00'; // Cod. De Sub concepto 03
          linea = linea + utils.pad('',14,'0'); // Valor de Sub Concepto 03
          linea = linea + '00'; // Cod. De Sub concepto 04
          linea = linea + utils.pad('',14,'0'); // Valor de Sub Concepto 04
          linea = linea + '00'; // Cod. De Sub concepto 05
          linea = linea + utils.pad('',14,'0'); // Valor de Sub Concepto 05
          linea = linea + '00'; // Cod. De Sub concepto 06
          linea = linea + utils.pad('',14,'0'); // Valor de Sub Concepto 06
          linea = linea + '00'; // Cod. De Sub concepto 07
          linea = linea + utils.pad('',14,'0'); // Valor de Sub Concepto 07
          linea = linea + '00'; // Cod. De Sub concepto 08
          linea = linea + utils.pad('',14,'0'); // Valor de Sub Concepto 08
          linea = linea + utils.pad('',72,' '); // Vacio  - Rellenar de Blancos

          dataArchivo = dataArchivo + linea + '\r\n';
          TotalRegistros = TotalRegistros + 1;
          TotalMaximo = TotalMaximo + (itemtabla.saldo);

        });

        //Totales
        linea = "";
        linea = linea + '03'; //Indicador de totales 03 (*)
        numtemp = TotalRegistros + 1000000000;
        linea = linea + numtemp.toString().substr(-9); //Indica la cantidad de registro a cobrar (*)
        numtemp = TotalMaximo * 100 + 1000000000000000000;
        linea = linea + numtemp.toString().substr(-18); //Total de los importes máximos a recaudar
        linea = linea + numtemp.toString().substr(-18); //Total de los importes mínimos igual a los maximos
        linea = linea + utils.pad('',18,'0'); //Rellenar de 18 ceros. Uso exclusivo del banco.
        linea = linea + utils.pad('',295,' ');//Vacio
        dataArchivo = dataArchivo + linea;

        //graba-archivo
        fecha = new Date().toISOString().replace('T', ' ').substr(0, 19);
        fecha = fecha.replace(/-/g, '').replace(/:/g, '').replace(/ /g, '');
        nomArchivo = 'unuRecaudo' + fecha + '.txt';
        pathFile = path.join(__dirname, '../../', 'data/exports', nomArchivo);
        fs.writeFile(pathFile, dataArchivo, 'utf8', function(err) {
          if (err) {
            return next(err);
          }
          var archivo = new ArchivoBanco({
            nombre: nomArchivo,
            registros: TotalRegistros,
            importeTotal: TotalMaximo,
            tipo: 'S',
            version: utils.pad(num.toString(),3,'0')
          });
          archivo.save(function(err, dato) {
            if (err) {
              return next(err);
            }
            next(null, dato);
          });
        });
      }
    });
  });
};
