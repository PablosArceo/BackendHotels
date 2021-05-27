'use strict';

//IMPORTACIONES
const express = require('express');
const facturaControlador = require('../controladores/factura.controlador');

//middlewares
var md_autenticacion = require('../middlewares/authenticated');

var api = express.Router();
api.post('/registrarFactura/:idReservacion',md_autenticacion.ensureAuth,facturaControlador.registrarFactura);
/* api.get('/visualizarFactura/:idReservacion',md_autenticacion.ensureAuth,facturaControlador.visualizarFactura);
 */ 
api.get('/obtenerFactura',md_autenticacion.ensureAuth,facturaControlador.obtenerFactura);



api.po


module.exports = api;