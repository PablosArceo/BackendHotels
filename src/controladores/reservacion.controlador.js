'use strict'

const Usuario = require('../modelos/usuario.model');
const bcrypt = require("bcrypt-nodejs");
const Hotel = require('../modelos/hotel.model');
const Habitacion = require('../modelos/habitacion.model');
const Reservacion = require('../modelos/reservacion.model');
const Servicio = require('../modelos/servicios.model');


const cliente = 'ROL_CLIENTE';
const gerente = 'ROL_GERENTE';
const ADMIN = 'ROL_ADMIN';

const fecha = new Date();
const reservado = 'Reservado';
const proceso = 'proceso';
const completado = 'Finalizado';
const cancelado = 'Cancelado'



  function reservacion(req,res){

    var params = req.body;
    var idUsuario = req.user.sub;
    var idHabitacion = req.params.idHabitacion;
    var ReservacionModel = Reservacion();


    if(params.fecha_llegada>params.fecha_salida) return res.status(500).send({mensaje: 'La fecha de llegada no puede ser despues que la fecha de salida'});

    var revisar = new Date(params.fecha_llegada);
    var revisarA = new Date(params.fecha_salida);

    if(fecha > revisar) return res.status(404).send({mensaje: 'Fecha ya caducada'});

    if(fecha == revisar) return res.status(404).send({mensaje: 'No puede reservar el mismo dia que la salidad'});
console.log(idHabitacion)
    Reservacion.find({idHabitacion: idHabitacion, $or: [ { estado: reservado}, {estado: 'proceso'} ] }, (err, reservacionEncontrada)=>{

    
    if(err) return res.status(404).send({mensaje: 'Error en la peticion de la reservacion'})

        reservacionEncontrada.forEach(element=>{
            if(params.fecha_llegada <= element.fecha_llegada && params.fecha_llegada>=element.fecha_salida){
            return res.status(404).send({mensaje: 'Habitacion ya reservada con aterioridad'});
        }

        if(params.fecha_salida <= element.fecha_llegada && params.fecha_salida>=element.fecha_salida){

            return res.status(404).send({mensaje: 'Habitacion ya reservada'});
        }

        if(params.fecha_salida <= element.fecha_llegada&& params.fecha_salida>=element.fecha_salida){
        return res.status(404).send({mensaje: 'Habitacion ya reservada'})
        }
    })

        Habitacion.findById(idHabitacion, (err, habitacionEncontrada)=>{

            if(err) return res.status(404).send({mensaje:'Error en la peticion de la habitacion'});

            if(!habitacionEncontrada) return res.status(200).send({mensaje:'La habitacion no existe'});

            ReservacionModel.idUsuario= idUsuario;
            ReservacionModel.idHabitacion= idHabitacion;;
            ReservacionModel.estado = reservado;
            ReservacionModel.fecha_llegada = params.fecha_llegada;
            ReservacionModel.fecha_salida = params.fecha_salida;

            ReservacionModel.save((err, reservacionGuardada)=>{

                if(err) return res.status(404).send({mensaje: 'error en la peticion de la reservacion'});

                if(!reservacionGuardada) return res.status(202).send({mensaje: 'Reservacion no guardada'});
                return res.status(200).send(reservacionGuardada)
            })

        })
})
}  
 







function eliminarReservacion(req,res) {

    var idReservacion = req.params.idReservacion;

    Reservacion.findByIdAndDelete(idReservacion,(err,reservacionEliminada)=>{

        if(err) return res.status(500).send({mensaje: 'Error en la petición'});
        if(!reservacionEliminada) return res.status(500).send({mensaje: 'Error al eliminar la reservación'});
        if(reservacionEliminada.idUsuario != req.user.sub) return res.status(500).send({mensaje: 'No posee los permisos necesarios para realizar esta acción'});

        return res.status(200).send({reservacionEliminada});
    })

}


function obtenerReservacionesPorCliente(req,res){

    var idUsuario = req.user.sub;

    if (req.user.rol != 'ROL_CLIENTE' ) return res.status(500).send({mensaje: 'Unicamente los administradores pueden editar habitaciones'})

        Reservacion.find({idUsuario: idUsuario},(err, reservacionesEncontradas)=>{

        if(err) return res.status(500).send({mensaje: 'Error en la petición de las reservaciones'});
    
        if(!reservacionesEncontradas) return res.status(500).send({mensaje: 'Error en la peticion de busqueda de las reservaciones'});
    
         return res.status(200).send({reservacionesEncontradas})
    
        })

}

function obtenerReservacionesGerente(req,res){

    var idHabitacion = req.params.idHabitacion;

    if(req.user.rol=='ROL_GERENTE'){

        Reservacion.find({idHabitacion: idHabitacion}).populate('idUsuario','usuario').exec((err, reservacionesEncontradas)=>{

            if(err) return res.status(500).send({mensaje: 'Error en la petición'});
            if(!reservacionesEncontradas) return res.status(500).send({mensaje: 'Error al encontrar las reservaciones'});
    
            return res.status(200).send({reservacionesEncontradas});
    
        })    

    }else{
        return res.status(500).send({mensaje: 'No posee los permisos necesarios para realizar esta acción'});
    }

}

/*  function servicionPorReservacion(req,res){
    var params = req.body;
    var reservacion = req.params.idReservacion;
    var servicio = req.params.idServicio;

    Reservacion.findOne({_id: reservacion}, (err, reservacionEncontrada)=>{
        for(let i=0; i<reservacionEncontrada.servicios.length; i++){
            if(reservacionEncontrada.servicios[i]==servicio){
                return res.status(500).send({mensaje: 'Servicio ya existe en la reservacion'})
            }
        }
        Reservacion.findOneAndUpdate({_id: reservacion}),
        {$push:{servicios:servicio}}, {new: true}, (err,reservacionActualizada)=>{
            if(err) return res.status(500).send({mensaje: 'Error al actualizar el servicio'});

            if(!reservacionActualizada) return res.status(202).send({mensaje: 'Error en la solicitud de actualizar el hotel'});

            return res.status(200).send(reservacionActualizada)
        }


    })


}
  */


function serviciosHotel(req,res){
    var idUsuario= req.user.sub;;
    Reservacion.find({idUsuario:idUsuario},(err, reservacionEncontrada)=>{
        if(err) return res.status(404).send({mensaje: 'Error en encontrar la reservacion'});

        if(!reservacionEncontrada) return res.status(404).send({mensaje: 'La reservacion no existe'});

        return res.status(200).send(reservacionEncontrada)

    }).populate('idServicio idHabitacion')

}


function obtenerServiciosHotel(req,res) {

    var idHotel = req.params.idHotel;

    Servicio.find({idHotel: idHotel},(err,serviciosEncontrados)=>{

        if(err) return res.status(500).send({mensaje: 'Error en la petición'});
        if(!serviciosEncontrados) return res.status(500).send({mensaje: 'Error al visualizar los servicios del hotel'});

        return res.status(200).send({serviciosEncontrados});

    }).populate('idServicio')
    
}


/* function hotelServicios(req,res){
var idHabitacion = req.params.idHabitacion;

console.log(idHabitacion)
     Habitacion.findById(idHabitacion, (err, habitacionEncontrada)=>{

            if(err) return res.status(404).send({mensaje:'Error en la peticion de la habitacion'});

            if(!habitacionEncontrada) return res.status(200).send({mensaje:'La habitacion no existe'});


        Servicio.find({idHotel:habitacionEncontrada.idHotel},(err,serviciosEncontrados)=>{

            
            if(err) return res.status(500).send({mensaje: 'Error en la petición'});
            if(!serviciosEncontrados) return res.status(500).send({msanaje: 'Error en el servicio'});
    
    

            return res.status(serviciosEncontrados)
        })
    })
     
} */

 function hotelServicios(req, res){
    var idHabitacion = req.params.idHabitacion;

    
    Habitacion.findById(idHabitacion, (err, habitacionEncontrada)=>{
            
            if(err){ return  res.status(500).send({mensaje : 'Error en la peticion'});
            }else if(habitacionEncontrada){

            Servicio.find({idHotel:habitacionEncontrada.idHotel}, (err, serviciosEncontrados) =>{
                    if(err){
                        return  res.status(500).send({mensaje : 'Error en la peticion'})
                    }else if(serviciosEncontrados){
                      return  res.send({serviciosEncontrados});
                    }else{
                        res.send({mensaje:'el hotel no existe'});
                    }
                });
            }else{
            return res.status(404).send({mensaje:'el hotel no existe'});
            }
        });
    }
 



module.exports ={

    reservacion,
    eliminarReservacion,
    obtenerReservacionesPorCliente,
    obtenerReservacionesGerente,
/*      servicionPorReservacion 
 */
    serviciosHotel,
    obtenerServiciosHotel,
    hotelServicios
}