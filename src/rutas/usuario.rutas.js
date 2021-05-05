'use strict'

// IMPORTACIONES
const express = require("express");
const usuarioControlador = require("../controladores/usuario.controlador")

// MIDDLEWARES
var md_autenticacion = require("../middlewares/authenticated")

// RUTAS
var api = express.Router();
api.post('/registrarUsuario', usuarioControlador.registrar);
api.get('/obtenerUsuarios', usuarioControlador.obtenerUsuarios);
api.get('/obtenerUsuarioId/:idUsuario', usuarioControlador.obtenerUsuarioID);
api.post('/login', usuarioControlador.login);
api.put('/editarUsuario/:idUsuario', md_autenticacion.ensureAuth, usuarioControlador.editarUsuario);
api.put('/editarUsuarioAdmin/:idUsuario', md_autenticacion.ensureAuth, usuarioControlador.editarUsuarioADMIN);
api.delete('/eliminarUsuario/:idUsuario', md_autenticacion.ensureAuth, usuarioControlador.eliminarUsuario);
api.delete('/eliminarUsuarioAdmin/:idUsuario', md_autenticacion.ensureAuth, usuarioControlador.eliminarUsuarioAdmin);



module.exports = api;