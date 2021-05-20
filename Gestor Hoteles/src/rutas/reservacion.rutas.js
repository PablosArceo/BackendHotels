'use strict';
const express = require("express");
const ReservacionControlador = require("../controladores/reservacion.controlador")
var md_autenticacion = require("../middlewares/authenticated")


var api = express.Router();

api.post('/registrarReservacion', md_autenticacion.ensureAuth,ReservacionControlador.registrarReservacion); 

module.exports = api;