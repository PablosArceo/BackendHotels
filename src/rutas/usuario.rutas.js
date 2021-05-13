'use strict'


const express = require("express");
const usuarioControlador = require("../controladores/usuario.controlador")
var md_autenticacion = require("../middlewares/authenticated")

var api = express.Router();

api.post('/login', usuarioControlador.login);

api.post('/registrarUsuario', usuarioControlador.registrar);
api.get('/obtenerUsuarios', usuarioControlador.obtenerUsuarios);
api.get('/obtenerUsuarioId/:idUsuario', usuarioControlador.obtenerUsuarioID);
api.put('/editarUsuario/:idUsuario', md_autenticacion.ensureAuth, usuarioControlador.editarUsuario);
api.delete('/eliminarUsuario/:idUsuario',md_autenticacion.ensureAuth,usuarioControlador.eliminarUsuario);

api.post('/registrarAdmin',usuarioControlador.registrarAdmin);
api.put('/editarUsuarioAdmin/:idUsuario', md_autenticacion.ensureAuth, usuarioControlador.editarUsuarioADMIN);
api.delete('/eliminarUsuario/:idUsuario', md_autenticacion.ensureAuth, usuarioControlador.eliminarUsuario);
api.delete('/eliminarUsuarioAdmin/:idUsuario', md_autenticacion.ensureAuth, usuarioControlador.eliminarUsuarioAdmin);


api.post('/registrarGerente',usuarioControlador.registrarGerente);
api.put('/editarGerente/:idUsuario', md_autenticacion.ensureAuth, usuarioControlador.editarGerente);
api.delete('/eliminarGerente/:idUsuario', md_autenticacion.ensureAuth, usuarioControlador.eliminarGerente);
api.get('/obtenerGerentes',md_autenticacion.ensureAuth,usuarioControlador.obtenerGerentes);

module.exports = api;