'use strict';
const express = require("express");
const hotelControlador = require("../controladores/hotel.controlador")
var md_autenticacion = require("../middlewares/authenticated")


var api = express.Router();
// ADMIN GENERAL
api.post('/nuevoHotel', md_autenticacion.ensureAuth, hotelControlador.nuevoHotel);
api.put('/editarHotel/:idHotel', md_autenticacion.ensureAuth, hotelControlador.editarHotel);
api.delete('/eliminarHotel/:idHotel', md_autenticacion.ensureAuth, hotelControlador.eliminarHotel);

api.put('/editarHotelGerente/:idHotel', md_autenticacion.ensureAuth, hotelControlador.editarHotelGerente);
api.delete('/eliminarHotelGerente/:idHotel', md_autenticacion.ensureAuth, hotelControlador.eliminarHotelGerente);


api.get('/obtenerNombreHotel/:nombreHotel',md_autenticacion.ensureAuth,hotelControlador.obtenerNombreHotel);



 // Habitaciones
/* api.put('/registrarHabitacion/:idHotel', md_autenticacion.ensureAuth, hotelControlador.registrarHabitacion);
api.put('/editarHab/:idHotel/:idHabitacion', md_autenticacion.ensureAuth, hotelControlador.editarHab);   */

api.get('/obtenerHoteles',md_autenticacion.ensureAuth, hotelControlador.obtenerHoteles);
api.get('/obtenerHotelesGerente',md_autenticacion.ensureAuth,hotelControlador.obtenerHotelesGerente);
api.get('/obtenerHotelID/:idHotel',md_autenticacion.ensureAuth,hotelControlador.obtenerHotelID);


module.exports = api;


