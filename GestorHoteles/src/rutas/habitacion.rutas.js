'use strict'


const express = require("express");
const habitacionControlador = require('../controladores/habitacion.controlador');


var md_autenticacion = require('../middlewares/authenticated');

var api = express.Router();
api.post('/registrarHabitacion',md_autenticacion.ensureAuth,habitacionControlador.registrarHabitacion);
api.put('/editarHab/:idHabitacion', md_autenticacion.ensureAuth, habitacionControlador.editarHab);
api.delete('eliminarHab/:idHabitacion', md_autenticacion.ensureAuth,habitacionControlador.eliminarHab);
api.get('/obtenerHabitacionesPorHotel/:idHotel',md_autenticacion.ensureAuth,habitacionControlador.obtenerHabitacionesPorHotel);

module.exports = api;
