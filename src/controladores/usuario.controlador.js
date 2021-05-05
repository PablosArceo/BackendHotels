'use strict'

const Usuario = require('../modelos/usuario.model');
const bcrypt = require("bcrypt-nodejs");
const jwt = require('../servicios/jwt');


// Login General
function login(req, res) {
    var params = req.body;

    Usuario.findOne({ usuario: params.usuario }, (err, usuarioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });

        if (usuarioEncontrado) {                                               //TRUE || FALSE 
            bcrypt.compare(params.password, usuarioEncontrado.password, (err, passCorrecta) => {
                if (passCorrecta) {
                    if (params.obtenerToken === 'true') {
                        return res.status(200).send({
                            token: jwt.createToken(usuarioEncontrado)
                        });
                    } else {
                        usuarioEncontrado.password = undefined;
                        return res.status(200).send({ usuarioEncontrado })
                    }
                } else {
                    return res.status(404).send({ mensaje: 'El usuario no se ha podido identificar' })
                }
            })
        } else {
            return res.status(404).send({ mensaje: 'El usuario no ha podido ingresar' })
        }
    })
}

// Registrarse como cliente nuevo

function registrar(req, res) {
    var usuarioModel = new Usuario();
    var params = req.body;
    if (params.usuario && params.email && params.password) {
        usuarioModel.nombre = params.nombre;
        usuarioModel.apellido = params.apellido;
        usuarioModel.usuario = params.usuario;
        usuarioModel.email = params.email;
        usuarioModel.rol = 'ROL_CLIENTE';
        usuarioModel.imagen = null;

        Usuario.find({
            $or: [
                { usuario: usuarioModel.usuario },
                { email: usuarioModel.email }
            ]
        }).exec((err, usuariosEncontrados) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion del Usuario' })

            if (usuariosEncontrados && usuariosEncontrados.length >= 1) {
                return res.status(500).send({ mensaje: 'El usuario ya existe' })
            } else {
                bcrypt.hash(params.password, null, null, (err, passwordEncriptada) => {
                    usuarioModel.password = passwordEncriptada;

                    usuarioModel.save((err, usuarioGuardado) => {
                        if (err) return res.status(500).send({ mensaje: 'Error al guardar el Usuario' })

                        if (usuarioGuardado) {
                            res.status(200).send(usuarioGuardado)
                        } else {
                            res.status(404).send({ mensaje: 'No se ha podido registrar el Usuario' })
                        }
                    })
                })
            }
        })
    }
}



function obtenerUsuarios(req, res) {
    Usuario.find((err, usuariosEncontrados) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion de Obtener Usuarios' })
        if (!usuariosEncontrados) return res.status(500).send({ mensaje: 'Error en la consulta de Usuarios' })
        return res.status(200).send({ usuariosEncontrados })
    

    })
}

function obtenerUsuarioID(req, res) {
    var idUsuario = req.params.idUsuario
    
    Usuario.findById(idUsuario, (err, usuarioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion del Usuario' })
        if (!usuarioEncontrado) return res.status(500).send({ mensaje: 'Error en obtener los datos del Usuario' })
        return res.status(200).send({ usuarioEncontrado })
    })
}

// Editar Cliente

function editarUsuario(req, res) {
    var idUsuario = req.params.idUsuario;
    var params = req.body;

    delete params.password;

    if(idUsuario != "ROL_CLIENTE"){
        return res.status(500).send({ mensaje: 'No posees los permisos necesarios para actulizar este Usuario.' });
    }

    Usuario.findByIdAndUpdate(idUsuario, params, { new: true }, (err, usuarioActualizado)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if(!usuarioActualizado) return res.status(500).send({ mensaje: 'No se ha podido actualizar al Usuario' });
        return res.status(200).send({ usuarioActualizado });
    })

    
}

// Eliminar Cliente

function eliminarUsuario(req, res) {
    const idUsuario = req.params.idUsuario;

    if(idUsuario != "ROL_CLIENTE"){
        return res.status(500).send({ mensaje: 'No posee los permisos para eliminar a este Usuario.' })
    }

    Usuario.findByIdAndDelete(idUsuario, (err, usuarioEliminado)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion de Eliminar' });
        if(!usuarioEliminado) return res.status(500).send({ mensaje: 'Error al eliminar el usuario.' });

        return res.status(200).send({ usuarioEliminado });
    })
}


// Editar  Admin
function editarUsuarioADMIN(req, res) {
    var idUsuario = req.params.idUsuario;
    var params = req.body;

    delete params.password;

    if(req.user.rol != "ROL_ADMIN"){
        return res.status(500).send({ mensaje: "Solo el Administrador puede editarlos" })
    }

    Usuario.findByIdAndUpdate(idUsuario, params, { new: true }, (err, usuarioActualizado)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if(!usuarioActualizado) return res.status(500).send({ mensaje: 'No se ha podido actualizar al Usuario' });
        return res.status(200).send({ usuarioActualizado });
    })

    
}


// Eliminar Admin

function eliminarUsuarioAdmin(req, res) {
    const idUsuario = req.params.idUsuario;

    if(req.user.rol != 'ROL_ADMIN'){
        return res.status(500).send({mensaje: 'Solo puede eliminar el Administrador.'})
    }

    Usuario.findByIdAndDelete(idUsuario, (err, usuarioEliminado)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion de Eliminar' });
        if(!usuarioEliminado) return res.status(500).send({ mensaje: 'Error al eliminar el usuario.' });

        return res.status(200).send({ usuarioEliminado });
    })
}



module.exports = {
    
    registrar,
    obtenerUsuarios,
    obtenerUsuarioID,
    login,
    editarUsuario,
    eliminarUsuario,
    editarUsuarioADMIN,
    eliminarUsuarioAdmin
}