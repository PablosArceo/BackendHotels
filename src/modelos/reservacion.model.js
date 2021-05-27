'use strict';
const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ReservacionSchema = Schema({
    idUsuario: {type: Schema.Types.ObjectId, ref:'usuarios'},
    estado: String,
    fecha_llegada: String,
    fecha_salida: String,
    idHabitacion: {type: Schema.Types.ObjectId, ref:'habitaciones'},


    idServicio:  [{type: Schema.Types.ObjectId, ref:'servicios'}]
 
})

module.exports = mongoose.model('reservaciones', ReservacionSchema);

