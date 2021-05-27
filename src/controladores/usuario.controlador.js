'use strict'

const Usuario = require('../modelos/usuario.model');
const bcrypt = require("bcrypt-nodejs");
const jwt = require('../servicios/jwt');




// Login General
function login(req, res) {
    var params = req.body;

    Usuario.findOne({ usuario: params.usuario }, (err, usuarioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });

        if (usuarioEncontrado) {                                               
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

  // ============  Cliente  ============


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


/// Restricion Solo para admin pendiente

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



function editarUsuario(req, res) {
    var idUsuario = req.params.idUsuario;
    var params = req.body;

    delete params.password;

    

    Usuario.findByIdAndUpdate(idUsuario, params, { new: true }, (err, usuarioActualizado)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if(!usuarioActualizado) return res.status(500).send({ mensaje: 'No se ha podido actualizar al Usuario' });
        return res.status(200).send({ usuarioActualizado });
    })

    
}



function eliminarUsuario(req, res) {
    const idUsuario = req.params.idUsuario;

   

    Usuario.findByIdAndDelete(idUsuario, (err, usuarioEliminado)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion de Eliminar' });
        if(!usuarioEliminado) return res.status(500).send({ mensaje: 'Error al eliminar el usuario.' });

        return res.status(200).send({ usuarioEliminado });
    })
}


  // ============ Admin Aplicacion   ============
  function registrarAdmin(req, res) {
    var usuarioModel = new Usuario();
    var params = req.body;
    if (params.usuario && params.email && params.password) {
        usuarioModel.nombre = params.nombre;
        usuarioModel.apellido = params.apellido;
        usuarioModel.usuario = params.usuario;
        usuarioModel.email = params.email;
        usuarioModel.rol = 'ROL_ADMIN';
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




function editarUsuarioADMIN(req, res) {
    var idUsuario = req.params.idUsuario;
    var params = req.body;

    delete params.password;

    if(req.user.rol != "ROL_ADMIN"){
        return res.status(500).send({ mensaje: "Solo el Administrador puede editar su perfil" })
    }

    Usuario.findByIdAndUpdate(idUsuario, params, { new: true }, (err, adminActualizado)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if(!adminActualizado) return res.status(500).send({ mensaje: 'No se ha podido actualizar al Usuario' });
        return res.status(200).send({ adminActualizado });
    })

    
}



function eliminarUsuarioAdmin(req, res) {
    const idUsuario = req.params.idUsuario;

    if(req.user.rol != 'ROL_ADMIN'){
        return res.status(500).send({mensaje: 'Solo el Administrador puede eliminar su perfil'})
    }

    Usuario.findByIdAndDelete(idUsuario, (err, adminEliminado)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion de Eliminar' });
        if(!adminEliminado) return res.status(500).send({ mensaje: 'Error al eliminar el usuario.' });

        return res.status(200).send({ adminEliminado });
    })
}


// ============ ADMIN HOTEL ============
function registrarGerente(req, res) {


    
    if(req.user.rol != "ROL_ADMIN"){
        return res.status(500).send({ mensaje: "Solo el Administrador puede editar su perfil" })
    }


    var usuarioModel = new Usuario();
    var params = req.body;
    if (params.usuario && params.email && params.password) {
        usuarioModel.nombre = params.nombre;
        usuarioModel.apellido = params.apellido;
        usuarioModel.usuario = params.usuario;
        usuarioModel.email = params.email;
        usuarioModel.rol = 'ROL_GERENTE';
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

function editarGerente(req, res) {
    var idUsuario = req.params.idUsuario;
    var params = req.body;

    delete params.password;

    if(req.user.rol != "ROL_GERENTE"){
        return res.status(500).send({ mensaje: "Solo el gerente  puede editar su perfil" })
    }

    Usuario.findByIdAndUpdate(idUsuario, params, { new: true }, (err, gerenteActualizado)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if(!gerenteActualizado) return res.status(500).send({ mensaje: 'No se ha podido actualizar al Usuario' });
        return res.status(200).send({ gerenteActualizado });
    })
}


function eliminarGerente(req, res) {
    const idUsuario = req.params.idUsuario;

    if(req.user.rol != 'ROL_GERENTE'){
        return res.status(500).send({mensaje: 'Solo el gerente puede eliminar su perfil'})
    }

    Usuario.findByIdAndDelete(idUsuario, (err, gerenteEliminado)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion de Eliminar' });
        if(!gerenteEliminado) return res.status(500).send({ mensaje: 'Error al eliminar el usuario.' });

        return res.status(200).send({ gerenteEliminado });
    })
}

/// Restricion Solo para admin pendiente

function obtenerGerentes(req, res) {
    Usuario.find({rol: 'ROL_GERENTE'},(err,usuariosEncontrados)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la petición de gerentes'});
        if(!usuariosEncontrados) return res.status(500).send({mensaje: 'No hay gerentes registrados'});

        return res.status(200).send({usuariosEncontrados});
    })

}


module.exports = {
    login,
    registrar,
    obtenerUsuarios,
    obtenerUsuarioID,
    editarUsuario,
    eliminarUsuario,
    registrarAdmin,
    editarUsuarioADMIN,
    eliminarUsuarioAdmin,
    registrarGerente,
    editarGerente,
    eliminarGerente,
    obtenerGerentes,
    
}