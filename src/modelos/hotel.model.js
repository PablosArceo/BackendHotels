'use strict';
const moongoose = require('moongose');
var Schema = moongoose.Schema;

var HotelSchema = Schema({
nombreHotel: String,
direccion: String,
adminHotel: {type: Schema.Types.ObjectId, ref:'usuarios'}
})

module.exports = moongoose.model('hoteles', HotelSchema);
