'use strict'

const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var EventoSchema = Schema({
    nombreEvento: String,
    capacidad: String,
    fecha: Date,
    idHotel: {type: Schema.Types.ObjectId, ref: 'hoteles'},
    idtipoEvento: {type: Schema.Types.ObjectId, ref: 'eventos'}
})

module.exports = mongoose.model('eventos',EventoSchema);