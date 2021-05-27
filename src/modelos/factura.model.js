'use strict';

const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FacturaSchema = Schema({
/*     idUsuario: {type: Schema.Types.ObjectId, ref: 'usuarios'},
 */ fecha_llegada: String,
    fecha_salida: String,
    precio: Number,


   /*  idHabitacion: {type: Schema.Types.ObjectId, ref:'habitaciones'},
    idReservacion: {type: Schema.Types.ObjectId, ref: 'reservaciones'},
    idServicio:[{type: Schema.Types.ObjectId, ref: 'servicios'}
    ], */
/*     total: {type:Number , default: 0} // Se actualiza al generar factura
 */})

module.exports = mongoose.model('facturas',FacturaSchema);