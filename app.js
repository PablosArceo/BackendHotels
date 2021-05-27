'use strict'

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors")

const usuario_ruta = require("./src/rutas/usuario.rutas");
const hotel_ruta = require("./src/rutas/hotel.rutas");
const evento_ruta = require("./src/rutas/evento.rutas");
const tipoEvento_ruta = require("./src/rutas/tipoEvento.rutas");
const servicios_ruta = require("./src/rutas/servicios.rutas");
const habitaciones_ruta = require("./src/rutas/habitacion.rutas");
const reservaciones_ruta = require("./src/rutas/reservacion.rutas");
const facturas_ruta = require("./src/rutas/factura.rutas");
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(cors());

app.use('/api',usuario_ruta, hotel_ruta, evento_ruta, tipoEvento_ruta, servicios_ruta, habitaciones_ruta,reservaciones_ruta, facturas_ruta );

module.exports = app;