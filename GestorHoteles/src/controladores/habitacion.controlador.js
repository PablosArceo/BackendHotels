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
    var idHabitacion = req.params.idHabitacion;

    if (req.user.rol != 'ROL_ADMIN' ) return res.status(500).send({mensaje: 'Unicamente los administradores pueden editar habitaciones'})
    
    Habitacion.findByIdAndUpdate(idHabitacion,params,{new: true, useFindAndModify: false},(err,habitacionActualizada)=>{

    if(err) return res.status(500).send({mensaje: 'Error en la petición de la habitacion'});
    if(!habitacionActualizada) return res.status(500).send({mensaje: 'Error al actualizar la habitacion seleccionada'});

    return res.status(200).send({habitacionActualizada});

    })
}

function eliminarHab(req,res) {
    
    var idHabitacion = req.params.idHabitacion;
    var params = req.body;
 
    if (req.user.rol != 'ROL_ADMIN') return res.status(500).send({mensaje: 'Unicamente los administrades pueden eliminar las habitaciones'})
 
    Habitacion.findByIdAndDelete(idHabitacion, (err, habitacionEliminada)=>{
 
    if(err) return res.status(500).send({mensaje: 'Error en la peticion de la habitacion'});
    if(!habitacionEliminada) return res.status(500).send({mensaje: 'Error en la peticion de eliminar la habitacion'});
    return res.status(500).send({habitacionEliminada});   
    });
 

}

function obtenerHabitacionesPorHotel(req,res){
    var idHotel = req.params.idHotel;

    Habitacion.find({idHotel:idHotel},(err,habitacionesEncontradas)=>{
        if(err) return res.status(404).send({report:'Error find rooms'});

        if(!habitacionesEncontradas) return res.status(200).send({report:'Hotel rooms not exist'});

        return res.status(202).send(habitacionesEncontradas);
    })
}
 



module.exports={
    registrarHabitacion,
    editarHab,
    eliminarHab,
    obtenerHabitacionesPorHotel
}