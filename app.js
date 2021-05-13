'use strict'

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors")

const usuario_ruta = require("./src/rutas/usuario.rutas");
const hotel_ruta = require("./src/rutas/hotel.rutas");
const evento_ruta = require("./src/rutas/evento.rutas");
const tipoEvento_ruta = require("./src/rutas/tipoEvento.rutas");

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(cors());

app.use('/api',usuario_ruta, hotel_ruta, evento_ruta, tipoEvento_ruta);

module.exports = app;