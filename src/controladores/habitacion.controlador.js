'use strict'

const Usuario = require('../modelos/usuario.model');
const Hotel = require('../modelos/hotel.model');
const Habitacion = require('../modelos/habitacion.model');


function registrarHabitacion(req,res) {
    
    var params= req.body;
    let habitacionModel = new Habitacion ();

    if(req.user.rol == 'ROL_ADMIN'){

        if(params.nombreHabitacion && params.numeroHabitacion &&  params.estado && params.precio && params.idHotel){
            habitacionModel.nombreHabitacion = params.nombreHabitacion;
            habitacionModel.numeroHabitacion = params.numeroHabitacion;
            habitacionModel.estado = params.estado;
            habitacionModel.precio = params.precio;
            habitacionModel.idHotel = params.idHotel;

            Habitacion.find({$or: [
                {nombreHabitacion: habitacionModel.nombreHabitacion},
            ]}).exec((err,habitacionesEncontradas)=>{
                if(habitacionesEncontradas && habitacionesEncontradas.length>=1){
                    return res.status(500).send({mensaje: 'El nombre de la habitacion ya se encuentra registrada en el hotel'})
                }else{
                    Hotel.findById(params.idHotel,(err,hotelEncontrado)=>{  
                        if(err) return res.status(500).send({mensaje: 'Error en la petición del hotel ingresado'});
                        if(!hotelEncontrado) return res.status(500).send({mensaje: 'El hotel no se encuentra en la base de datos '});
                        
                        habitacionModel.save((err, habitacionGuardada)=>{
                            if(err) return res.status(500).send({mensaje: 'Error en la petición de la habitacion'});
                            if(habitacionGuardada){
                                return res.status(200).send({habitacionGuardada});
                            }
                        })
                    })
                }
            })
        }else{
            return res.status(500).send({mensaje: 'Por favor ingrese todos los datos para registrar un servicio'})
        }
    }else{
        return res.status(500).send({mensaje: 'Unicamente los gerentes pueden registrar servicios'});
    }
}

function editarHab(req,res) {
    
    var params = req.body;
    var idServicio = req.params.idServicio;

    if (req.user.rol != 'ROL_GERENTE') return res.status(500).send({mensaje: 'Unicamente los gerentes pueden eliminar servicios'})
    
    Servicio.findByIdAndUpdate(idServicio,params,{new: true, useFindAndModify: false},(err,servicioActualizado)=>{

    if(err) return res.status(500).send({mensaje: 'Error en la petición del servicio'});
    if(!servicioActualizado) return res.status(500).send({mensaje: 'Error al actualizar el Servicio seleccionado'});

    return res.status(200).send({servicioActualizado});

    })
   

}

   
 


module.exports={
    registrarHabitacion,
    editarHab


}