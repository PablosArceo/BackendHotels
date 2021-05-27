'use strict'
const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UsuarioSchema = Schema({
    usuario: String,
    nombre: String,
    apellido: String,
    email: String,
    rol: String,
    password: String,
    imagen: String

})

module.exports = mongoose.model('usuarios', UsuarioSchema)