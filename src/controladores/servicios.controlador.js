'use strict'

const Hotel = require('../modelos/hotel.model');
const Servicio = require('../modelos/servicios.model');
const Reservacion = require('../modelos/reservacion.model');


function crearServicio(req,res) {


    var idHotel = req.params.idHotel
    var params= req.body;

    let servicioModel = new Servicio();

    if(req.user.rol == 'ROL_ADMIN'){

        if(params.nombreServicio && params.precio){

            servicioModel.nombreServicio = params.nombreServicio;
            servicioModel.precio = params.precio;
            servicioModel.idHotel = idHotel;

            Servicio.find({$or: [
                {nombreServicio: servicioModel.nombreServicio},
            ]}).exec((err,serviciosEncontrados)=>{
                if(serviciosEncontrados && serviciosEncontrados.length>=1){
                    return res.status(500).send({mensaje: 'El servicio ya existe'})
                }else{
                    
                    Hotel.findById(idHotel,(err,hotelEncontrado)=>{
                        
                        if(err) return res.status(500).send({mensaje: 'Error en la petición del Hotel'});
                        if(!hotelEncontrado) return res.status(500).send({mensaje: 'El hotel ingresado no existe'});

                        servicioModel.save((err,servicioGuardado)=>{
                            if(err) return res.status(500).send({mensaje: 'Error en la petición'});

                            if(servicioGuardado){
                                return res.status(200).send({servicioGuardado});
                            }

                        })

                    })

                }
            })
            
        }else{
            return res.status(500).send({mensaje: 'Debe llenar los datos'})
        }

    }else{
        return res.status(500).send({mensaje: 'No posee los permisos necesarios para realizar esta acción'});
    }

}


function editarServicio(req,res) {
    
        var params = req.body;
        var idServicio = req.params.idServicio;

        if (req.user.rol != 'ROL_ADMIN') return res.status(500).send({mensaje: 'Unicamente los gerentes pueden eliminar servicios'})
        
        Servicio.findByIdAndUpdate(idServicio,params,{new: true, useFindAndModify: false},(err,servicioActualizado)=>{
    
        if(err) return res.status(500).send({mensaje: 'Error en la petición del servicio'});
        if(!servicioActualizado) return res.status(500).send({mensaje: 'Error al actualizar el Servicio seleccionado'});
    
        return res.status(200).send({servicioActualizado});
    
        })
       

}

function eliminarServicio(req,res) {
    
        var idServicio = req.params.idServicio;
        var params = req.body;
     
        if (req.user.rol != 'ROL_ADMIN') return res.status(500).send({mensaje: 'Unicamente los gerentes pueden eliminar servicios'})
     
        Servicio.findByIdAndDelete(idServicio, (err, servicioEliminado)=>{
     
        if(err) return res.status(500).send({mensaje: 'Error en la peticion de servicios'});
        if(!servicioEliminado) return res.status(500).send({mensaje: 'Error en la peticion de eliminar el servicio'});

        return res.status(200).send({servicioEliminado});   
        });
     

}

function obtenerServicios(req,res) {
    
    Servicio.find((err,serviciosEncontrados)=>{

        if(err) return res.status(500).send({mensaje: 'Error en la petición del servicio'});
        if(!serviciosEncontrados) return res.status(500).send({mensaje: 'Error en la peticion de obtener Servicios'});

        return res.status(200).send({serviciosEncontrados})

    })

}

function obtenerServiciosID(req, res) {
    var idServicio = req.params.idServicio
    
    
    Servicio.findById(idServicio, (err, servicioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion del hotel' })
        if (!servicioEncontrado) return res.status(500).send({ mensaje: 'Error en obtener los datos del hotel' })
        return res.status(200).send({ servicioEncontrado })
    })
}



function obtenerServiciosPorHotel(req,res) {

    var idHotel = req.params.idHotel;

    Servicio.find({idHotel: idHotel},(err,serviciosEncontrados)=>{

        if(err) return res.status(500).send({mensaje: 'Error en la petición'});
        if(!serviciosEncontrados) return res.status(500).send({mensaje: 'Error al visualizar los servicios del hotel'});

        return res.status(200).send({serviciosEncontrados});

    })
    
}



function servicioPorReservacion(req,res){
//    var params = req.body;
    var reservacion = req.params.idReservacion;
    var servicio = req.params.idServicio;

    Reservacion.findOne({_id: reservacion}, (err, reservacionEncontrada)=>{
        for(let i=0; i<reservacionEncontrada.idServicio.length; i++){
            if(reservacionEncontrada.idServicio[i]==servicio){
                return res.status(500).send({mensaje: 'Servicio ya existe en la reservacion'})
            }
        }
        Reservacion.findOneAndUpdate({_id: reservacion},
        {$push:{idServicio:servicio}}, {new: true}, (err,reservacionActualizada)=>{
            if(err) return res.status(500).send({mensaje: 'Error al actualizar el servicio'});

            if(!reservacionActualizada) return res.status(202).send({mensaje: 'Error en la solicitud de actualizar el hotel'});

            return res.status(200).send(reservacionActualizada)
        })


    })

}




     
        
module.exports ={
    crearServicio,
    editarServicio,
    eliminarServicio,
    obtenerServicios,
    obtenerServiciosID,
    obtenerServiciosPorHotel,
    servicioPorReservacion

} 