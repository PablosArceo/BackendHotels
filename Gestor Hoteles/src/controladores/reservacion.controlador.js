
const Usuario = require('../modelos/usuario.model');
const bcrypt = require("bcrypt-nodejs");
const Hotel = require('../modelos/hotel.model');
const Habitacion = require('../modelos/habitacion.model');
const Reservacion = require('../modelos/reservacion.model');



function registrarReservacion(req,res) {

    var params = req.body;
    let reservacionModel = new Reservacion();

    if (req.user.rol != 'ROL_CLIENTE') return res.status(500).send({mensaje:'Unicamente los usuarios pueden realizar una reservacion'})

        if(params.nombreReservacion && params.fecha_llegada){  
            reservacionModel.nombreReservacion = params.nombreReservacion;
            reservacionModel.idUsuario = params.idUsuario;
            reservacionModel.idHabitacion = params.idHabitacion;
            reservacionModel.fecha_llegada = params.fecha_llegada;
            reservacionModel.fecha_salida = params.fecha_salida;

        Reservacion.find({$or: [
        {nombreReservacion: reservacionModel.nombreReservacion}
        ]}).exec((err,reservacionesEncontradas) => {

            if(reservacionesEncontradas && reservacionesEncontradas.length >=1){
                return res.status(500).send({mensaje: 'La reservacion ya existe'});
                }else{

                Usuario.findById(params.idUsuario,(err,usuarioEncontrado)=>{

                        if(err) return res.status(500).send({mensaje: 'Error en la petición del usuario'});
                        if(!usuarioEncontrado) return res.status(500).send({mensaje: 'El usuario no se encuentra registrado'});
    

                    Habitacion.findById(params.idHabitacion,(err,habitacionEncontrada) => {
                    
                    if(err) return res.status(500).send({mensaje: 'Error en la petición de la habitacion'});
                    if(!habitacionEncontrada) return res.status(500).send({mensaje: 'La habitacion ingresada no se encuentra registrada'});


                 // Resolver Error

                    reservacionModel.save((err, reservacionGuardada)=>{
                        if(err) return res.status(500).send({mensaje: 'Error en la petición de la reservacion'});
        
                            if(reservacionGuardada){
                            return res.status(200).send({reservacionGuardada});
                                }
                            })

                        })

                    })

                }

            })

        }else{
            return res.status(500).send({mensaje: 'Por favor ingrese todos los datos'});
        }   
} 

module.exports ={

    registrarReservacion
}