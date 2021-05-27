'use strict';
const express = require("express");
const servicioControlador = require("../controladores/servicios.controlador")
var md_autenticacion = require("../middlewares/authenticated")


var api = express.Router();

api.post('/crearServicio/:idHotel',md_autenticacion.ensureAuth,servicioControlador.crearServicio);
api.put('/editarServicio/:idServicio',md_autenticacion.ensureAuth,servicioControlador.editarServicio);
api.delete('/eliminarServicio/:idServicio',md_autenticacion.ensureAuth,servicioControlador.eliminarServicio);
api.get('/obtenerServicios',md_autenticacion.ensureAuth,servicioControlador.obtenerServicios); 
api.get('/obtenerServiciosID/:idServicio',md_autenticacion.ensureAuth,servicioControlador.obtenerServiciosID); 
api.get('/obtenerServiciosPorHotel/:idHotel',md_autenticacion.ensureAuth,servicioControlador.obtenerServiciosPorHotel); 


api.put('/servicioPorReservacion/:idReservacion/:idServicio', servicioControlador.servicioPorReservacion)


module.exports = api;



