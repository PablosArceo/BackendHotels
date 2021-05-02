'use strict'

const express = require('express');
const usuarioControlador = require('../controladores/usuario.controlador');
const md_autentication = require('../middlewares/authenticated');


const api = express.Router();

//     === Login  General ===
api.post('/login', usuarioControlador.login );




//      === Cliente ===
api.post('/registrarCliente',usuarioControlador.registrarCliente );


module.exports = api;