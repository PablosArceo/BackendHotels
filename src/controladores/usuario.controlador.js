'use strict'

var bcrypt  = require('bcrypt-nodejs');
var jwt = require('../servicios/jwt');
var Usuario = require('../modelos/usuario.model');
const { param } = require('../rutas/usuario.rutas');


// Login General

function login(req, res){
    var params = req.body;
    
    Usuario.findOne({ user: params.user }, (err,  usuarioEncontrado)=>{
    if (err) return res.status(500).send({ mensaje: 'Error en la peticion'});
    
    if (usuarioEncontrado){                         
           bcrypt.compare(params.password, usuarioEncontrado.password, (err, passwordCorrect)=> {
               if(passwordCorrect){
                   if(params.obtenerToken === 'true'){
                       return res.status(200).send({
                       token: jwt.createToken(usuarioEncontrado)
                   });
    
               }else{
                   usuarioEncontrado.password = undefined;
                   return res.status(200).send({ usuarioEncontrado })
               }
           }else{
               return res.status(404).send({ mensaje: 'El Usuario no se ha podedido identificar'})
           }
    })
    }else{
        return res.status(404).send({mensaje: 'EL Usuario no se ha podido ingresar'})
    }
    })
    }


    
   // Registrarse Como Cliente Nuevo
function registrarCliente(req,res) {
var usuarioModel = new Usuario;
var params = req.body;


if (params.user && params.nombre && params.apellido && params.email &&  params. password){
    usuarioModel.user=params.user;
    usuarioModel.nombre=params.nombre;
    usuarioModel.apellido=params.apellido;
    usuarioModel.email=params.email;
    usuarioModel.rol = "ROL_CLIENTE"
    Usuario.find({user:usuarioModel.user}).exec((err, usuarioEncontrado)=>{
    if(err) return res.status(500).send({mensaje: 'Error en la peticion del cliente'})
    if (usuarioEncontrado && usuarioEncontrado.length >=1 ){
       return res.status(500).send({mensaje:'El Cliente ya Existe'})

    }else{
        bcrypt.hash(params.password, null, null, (err, passwordEncriptada)=>{
        usuarioModel.password = passwordEncriptada;
        usuarioModel.save((err, UsuarioGuardado)=>{
            if (err) res.status(500).send({mensaje: 'Error en la peticion del Cliente'})
            if(usuarioEncontrado){
              return res.status(200).send(UsuarioGuardado);

            }else{
                return res.status(500).send({mensaje: 'Error al guardar el Cliente'})
            }

        })

        })
    }

    })


}else{
    return res.status(500).send({mensaje: 'Llene todos los campos para registrar un cliente'})
}
}



  



    
module.exports={
login,
registrarCliente,


    }