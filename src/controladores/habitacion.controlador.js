'use strict'

const Usuario = require('../modelos/usuario.model');
const Hotel = require('../modelos/hotel.model');
const Habitacion = require('../modelos/habitacion.model');



 
 function registrarHabitacion(req,res) {


    var idHotel = req.params.idHotel
    var params= req.body;

    let habitacionModel = new Habitacion();

    if(req.user.rol == 'ROL_ADMIN'){

        if(params.nombreHabitacion && params.precio){

            habitacionModel.nombreHabitacion = params.nombreHabitacion;
            habitacionModel.precio = params.precio;
            habitacionModel.idHotel = idHotel;

            Habitacion.find({$or: [
                {nombreHabitacion: habitacionModel.nombreHabitacion},
            ]}).exec((err,habitacionEncontrada)=>{
                if(habitacionEncontrada && habitacionEncontrada.length>=1){
                    return res.status(500).send({mensaje: 'la habitacion ya se encuentra registrada'})
                }else{
                    
                    Hotel.findById(idHotel,(err,hotelEncontrado)=>{
                        
                        if(err) return res.status(500).send({mensaje: 'Error en la petición del Hotel'});
                        if(!hotelEncontrado) return res.status(500).send({mensaje: 'El hotel ingresado no existe'});

                        habitacionModel.save((err,habitacionGuardada)=>{
                            if(err) return res.status(500).send({mensaje: 'Error en la petición'});

                            if(habitacionGuardada){
                                return res.status(200).send({habitacionGuardada});
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


function obtenerHabitacionID(req, res) {
    var idHabitacion = req.params.idHabitacion
    
    
    Habitacion.findById(idHabitacion, (err, habitacionEncontrada) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion de la habitacion' })
        if (!habitacionEncontrada) return res.status(500).send({ mensaje: 'Error en obtener los datos de la habitacion' })
        return res.status(200).send({ habitacionEncontrada })
    })
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



function obtenerHabitacionHotel(req,res){
    var idHotel = req.params.idHotel;
    var params= req.body

    console.log(idHotel)
    Habitacion.find({ idHotel:idHotel },(err,habitacionEncontrada)=>{
        if(err) return res.status(500).send({mensaje:'Error encontrando habitaciones'});

        if(!habitacionEncontrada) return res.status(500).send({mensaje:'La habitacion no existe en el hotel'});

        return res.status(200).send(habitacionEncontrada);
    })
}



function buscarHabitacionFecha(req,res){
    var params = req.body
  
    const fecha = new Date();
  
    if(fecha<params.fecha_llegada) return console.log('-')
  
    if(params.fecha_llegada>params.fecha_salida) return console.log('**')
  
    if(params.fecha_llegada<params.fecha_salida) return console.log('--')
  
    return console.log(params)
  
  }



module.exports={
    registrarHabitacion,
    editarHab,
    eliminarHab,
    obtenerHabitacionID,
    obtenerHabitacionHotel,
    buscarHabitacionFecha
}