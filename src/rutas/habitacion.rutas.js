'use strict'


const express = require("express");
const habitacionControlador = require('../controladores/habitacion.controlador');


var md_autenticacion = require('../middlewares/authenticated');

var api = express.Router();
api.post('/registrarHabitacion',md_autenticacion.ensureAuth,habitacionControlador.registrarHabitacion);




module.exports = api;
