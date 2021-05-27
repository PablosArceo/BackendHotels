'use strict';
const express = require("express");
const ReservacionControlador = require("../controladores/reservacion.controlador")
var md_autenticacion = require("../middlewares/authenticated")


var api = express.Router();

/* api.post('/reservacion', md_autenticacion.ensureAuth,ReservacionControlador.reservacion); 
 */

api.post('/reservacion/:idHabitacion', md_autenticacion.ensureAuth,ReservacionControlador.reservacion); 
api.delete('/eliminarReservacion/:idReservacion', md_autenticacion.ensureAuth, ReservacionControlador.eliminarReservacion);
api.get('/obtenerReservacionesPorCliente',md_autenticacion.ensureAuth, ReservacionControlador.obtenerReservacionesPorCliente);
api.get('/obtenerReservacionesGerente/:idHabitacion',md_autenticacion.ensureAuth, ReservacionControlador.obtenerReservacionesGerente);

api.get('/serviciosHotel/:idUsuario',md_autenticacion.ensureAuth, ReservacionControlador.serviciosHotel);
api.get('/obtenerServiciosHotel/:idHotel',md_autenticacion.ensureAuth, ReservacionControlador.obtenerServiciosHotel);

api.get('/hotelServicios/:idHabitacion',md_autenticacion.ensureAuth, ReservacionControlador.hotelServicios);




module.exports = api;
 
