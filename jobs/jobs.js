'use strict';
/* jshint esnext:true*/
const schedule = require('node-schedule');

const j = schedule.scheduleJob('*/5 * * * * *', ()=>{
  console.log('The answer to life, the universe, and everything!');
  //TODO cambiar la fecha del proceso para que se ejecute todos los dias a las 00:00:00
  //TODO cambiar el estado de los compromisopagos a inactivos
});
