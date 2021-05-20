'use strict';
const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ReservacionSchema = Schema({
    nombreReservacion: String,
    idUsuario: {type: Schema.Types.ObjectId, ref:'usuarios'},
    idHabitacion: {type: Schema.Types.ObjectId, ref:'habitaciones'},
    fecha_llegada: Date,
    fecha_salida: Date,
/*     idServicio:  {type: Schema.Types.ObjectId, ref:'habitaciones'}
 */
})

module.exports = mongoose.model('reservaciones', ReservacionSchema);
