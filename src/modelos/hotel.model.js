'use strict';
const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var HotelSchema = Schema({
nombreHotel: String,
direccion: String,
puntuacion: {type: Number, default: 0}, // Dejar como Number unicamente

    habitaciones:[{
    numeroHabitacion: {type: Number},
    nombreHabitacion: String,
    estado: String,
    precio: {type: Number, default:0}
}], 

idGerente: {type: Schema.Types.ObjectId, ref:'usuarios'}
})

module.exports = mongoose.model('hoteles', HotelSchema)