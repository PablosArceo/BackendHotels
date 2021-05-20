'use strict';
const express = require("express");
const servicioControlador = require("../controladores/servicios.controlador")
var md_autenticacion = require("../middlewares/authenticated")


var api = express.Router();

api.post('/crearServicio',md_autenticacion.ensureAuth,servicioControlador.crearServicio);
api.put('/editarServicio/:idServicio',md_autenticacion.ensureAuth,servicioControlador.editarServicio);
api.delete('/eliminarServicio/:idServicio',md_autenticacion.ensureAuth,servicioControlador.eliminarServicio);

module.exports = api;



