'use strict'

const mongoose = require("mongoose")
const app = require('./app')

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/SkyHotel', { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
  console.log('Se encuentra conectado a la base de datos');
 
  app.listen(3900, function () {
    console.log('El servidor esta arrancando en el puerto: 3900');  
  })

}).catch(err => console.log(err))


