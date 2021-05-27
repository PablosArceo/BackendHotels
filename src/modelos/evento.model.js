'use strict'

const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var EventoSchema = Schema({
    nombreEvento: String,
    capacidad: String,
    fecha: String,
    idtipoEvento: {type: Schema.Types.ObjectId, ref: 'eventos'},

    idHotel: {type: Schema.Types.ObjectId, ref: 'hoteles'},
})

module.exports = mongoose.model('eventos',EventoSchema);