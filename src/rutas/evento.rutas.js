'use strict'


const express = require("express");
const eventoControlador = require("../controladores/evento.controlador")


var md_autenticacion = require('../middlewares/authenticated');

var api = express.Router();
api.post('/registrarEvento/:idHotel',md_autenticacion.ensureAuth,eventoControlador.registrarEvento);
api.put('/editarEvento/:idEvento',md_autenticacion.ensureAuth,eventoControlador.editarEvento);
api.delete('/eliminarEvento/:idEvento',md_autenticacion.ensureAuth,eventoControlador.eliminarEvento);


api.get('/obtenerEventos',md_autenticacion.ensureAuth,eventoControlador.obtenerEventos); 
api.get('/obtenerEventosID/:idEvento',md_autenticacion.ensureAuth,eventoControlador.obtenerEventosID); 

api.get('/obtenerEventosPorNombre/:nombreEvento', md_autenticacion.ensureAuth, eventoControlador.obtenerEventosPorNombre);


api.get('/obtenerEventosPorHotel/:idHotel', md_autenticacion.ensureAuth, eventoControlador.obtenerEventosPorHotel);
/* api.get('/obtenerEventosPorNombreHotel/:nombreHotel',md_autenticacion.ensureAuth,eventoControlador.obtenerEventosPorNombreHotel);
 */


api.get('/obtenerPorTipoEvento/:idHotel/:idtipoEvento', md_autenticacion.ensureAuth,eventoControlador.obtenerPorTipoEvento);
module.exports = api;
