var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
module.exports = function(request,user,alumno,next){
  var transport  = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      }));
  var mailOptions = {
        to: 'nmedinson@gmail.com',//alumno.email,
        from: 'nmedinson@gmail.com',
        subject: 'Node.js Password Reset',
        text: 'Hola '+user.firstname+',\n\n' +
        'Recibimos una solicitud de cambio de contraseña. Para confirmar tu nueva contraseña haz click en el siguiente enlace: \n\n' +
          'http://' + request.headers.host + '#/resetpassword/' + user.resetPasswordToken + '\n\n' +
          'Por favor, ignora este mensaje en el caso que no hayas solicitado un cambio de contraseña de tu cuenta.\n'
      };
         console.log('1. send email...',mailOptions);

      transport .sendMail(mailOptions, function(err) {
        console.log('send email...');
        next(err, 'done');
      });
}