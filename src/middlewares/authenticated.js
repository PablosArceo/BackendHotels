'use strict'

var jwt = require('jwt-simple')
var moment = require('moment')
var secret = 'clave_secreta'

exports.ensureAuth = function (req,res,next) {
   if(!req.headers.authorization){
        return res.status(401).send({ mensaje:'Solo el maestro puede efectuar esta acción' })
   } 

   var token = req.headers.authorization.replace(/['"]+/g, '')
   
   try{
       var payload = jwt.decode(token,secret);

        // Exp = Variable que contiene el tiempo de expiración del token
       if (payload.exp <= moment().unix()) {
          return res.status(401).send({
             mensaje: 'El mensaje ha expirado'
          })

       }
   }catch(error) {
      return res.status(404).send({
         mensaje: "El token no es valido"
      })
   }
  req.user = payload;
  next();
} 