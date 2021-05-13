'use strict'

const mongoose = require("mongoose")
const Usuario = require('./src/modelos/usuario.model');
const bcrypt = require('bcrypt-nodejs');

const app = require('./app')

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/SkyHotel', { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
  console.log('Se encuentra conectado a la base de datos');
 
  var usuario1 = 'ADMIN';
 
    var password = '123';
    var rol = 'ROL_ADMIN';
   
    var usuarioModel = new Usuario(); 
    
    usuarioModel.usuario = usuario1;
    usuarioModel.rol = rol;
    
    Usuario.find({ usuario: usuarioModel.usuario }).exec((err, usuariosEncontrados)=>{
      if(usuariosEncontrados && usuariosEncontrados.length ==1){
          return console.log('Administrador Ya existente');
      }else{
        bcrypt.hash(password, null,null, (err,passwordEncriptada)=>{
            usuarioModel.password = passwordEncriptada;

            usuarioModel.save((err, usuariosEncontrados)=>{
            if(err) return res.status(500).send({mensaje: 'Error en el sistema'})
            if(usuariosEncontrados){
             return console.log(usuariosEncontrados);

            }else{
              return res.status(500).send({ mensaje: 'Admin no guardado'})
            }

            })
        })
      }

    }  )
   
  app.listen(3900, function () {
    console.log('El servidor esta arrancando en el puerto: 3900');  
  })



}).catch(err => console.log(err))


