'use strict';
const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var HotelSchema = Schema({
nombreHotel: String,
direccion: String,
puntuacion: {type: Number, default: 0}, // Dejar como Number unicamente



idGerente: {type: Schema.Types.ObjectId, ref:'usuarios'}
})

module.exports = mongoose.model('hoteles', HotelSchema)