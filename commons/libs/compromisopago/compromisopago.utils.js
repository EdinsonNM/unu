module.exports.RemplazaCaracteres= function RemplazaCaracteres(cadtemp){
  var cadena=cadtemp + " ";
  var A=['Ä','Á','À','á','à','Ã','ã','â','Â','ä'];
  var E=['Ë','É','È','é','è ê','Ê','ë'];
  var I=['Ï','Í','Ì','í','ì î','Î','ï'];
  var O=['Ö','Ó','Ò','ó','ò Õ','õ','ô','Ô','ö'];
  var U=['Ü','Ú','Ù','ú','ù û','Û','ü'];
  var N=['±','Ñ','ñ'];
  var Y=['ÿ','ý','Ý'];
  var D=['Ð.'];
  var Espacio=['"',';',',','+','!','#','$','%','/','(','\\','¡','¿','´','~','[','}',']','`','<','>','_',')','^',':','|','°','¬','=','?','º'];
  var j=0;
  for (j=0; j<A.length; j++) { cadena=cadena.replace(new RegExp(A[j],'g'), "A"); }
  for (j=0; j<E.length; j++) { cadena=cadena.replace(new RegExp(E[j],'g'), "E"); }
  for (j=0; j<I.length; j++) { cadena=cadena.replace(new RegExp(I[j],'g'), "I"); }
  for (j=0; j<O.length; j++) { cadena=cadena.replace(new RegExp(O[j],'g'), "O"); }
  for (j=0; j<U.length; j++) { cadena=cadena.replace(new RegExp(U[j],'g'), "U"); }
  for (j=0; j<N.length; j++) { cadena=cadena.replace(new RegExp(N[j],'g'), "N"); }
  for (j=0; j<Y.length; j++) { cadena=cadena.replace(new RegExp(Y[j],'g'), "Y"); }
  cadena=cadena.replace(new RegExp(D[0],'g'), "D");
  for (j=0; j<Espacio.length; j++) { cadena=cadena.replace(new RegExp(Espacio[j],'g'), " "); }
  return cadena.toUpperCase();

};

module.exports.pad = function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};
