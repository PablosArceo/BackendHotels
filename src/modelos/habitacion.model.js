'use strict'
const mongoose = require('mongoose')
var Schema = mongoose.Schema;

var habitacionSchema = Schema({
nombreServicio: String,
numeroHabitacion: Number,
estado: String,
precio: Number, 


idHotel: {type: Schema.Types.ObjectId, ref:'hoteles'}


});

module.exports = mongoose.model('habitaciones', habitacionSchema);