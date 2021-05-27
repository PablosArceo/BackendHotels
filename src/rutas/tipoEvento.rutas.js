'use strict'

const express = require("express");
const tipoEventoControlador = require("../controladores/tipoEvento.controlador")


var md_autenticacion = require('../middlewares/authenticated');

var api = express.Router();

api.post('/registrarTipoEvento',md_autenticacion.ensureAuth,tipoEventoControlador.crearTipoEvento);
api.put('/editarTipoEvento/:idTipoEvento',md_autenticacion.ensureAuth,tipoEventoControlador.editarTipoEvento);

api.delete('/eliminarTipoEvento/:idTipoEvento',md_autenticacion.ensureAuth,tipoEventoControlador.eliminarTipoEvento);
api.get('/obtenerTipoEvento',md_autenticacion.ensureAuth,tipoEventoControlador.obtenerTipoEvento);
api.get('/obtenerTipoEvento',md_autenticacion.ensureAuth,tipoEventoControlador.obtenerTipoEvento);
api.get('/obtenerTipoEventoID/:idTipoEvento',md_autenticacion.ensureAuth,tipoEventoControlador.obtenerTipoEventoID);



module.exports = api;