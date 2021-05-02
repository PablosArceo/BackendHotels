'use strict'
const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UsuarioSchema = Schema({
    user: String,
    nombre: String,
    apellido: String,
    email: String,
    rol: String,
    password: String
    



})

module.exports = mongoose.model('Usuarios', UsuarioSchema)