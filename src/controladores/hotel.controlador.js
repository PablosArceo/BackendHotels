'use strict'

const Usuario = require('../modelos/usuario.model');
const bcrypt = require("bcrypt-nodejs");
const Hotel = require('../modelos/hotel.model');
const jwt = require('../servicios/jwt');


  // ============ Administrador Aplicacion =================
   function nuevoHotel(req,res){

    var params = req.body;
    let hotelModel = new Hotel();

    if(req.user.rol == 'ROL_ADMIN'){
        
        if(params.nombreHotel && params.direccion && params.idGerente){

            Hotel.find({$or: [
                {nombreHotel: hotelModel.nombreHotel},
                {direccion: hotelModel.direccion}
            ]}).exec((err,hotelesEncontrados)=>{

                if(hotelesEncontrados && hotelesEncontrados.length >=1){
                    return res.status(500).send({mensaje: 'El hotel ya existe'});
                }else{

                    Usuario.findById(params.idGerente,(err,usuarioEncontrado)=>{

                            if(usuarioEncontrado.rol === 'ROL_CLIENTE') return res.status(500).send({mensaje: 'El usuario seleccionado no posee los permisos para ser administrador de Hotel'});
                            if(!usuarioEncontrado) return res.status(500).send({mensaje: 'El usuario no existe'});  

                            hotelModel.nombreHotel = params.nombreHotel;
                            hotelModel.direccion = params.direccion;
                            hotelModel.idGerente = params.idGerente;

                            hotelModel.save((err,hotelGuardado)=>{
                                if(err) return res.status(500).send({mensaje: 'Error al guardar el hotel'});
                        
                                if(hotelGuardado){
                                    return res.status(200).send({hotelGuardado});
                                }
                            })

                    })
                }

            })
    
        }else{
            return res.status(500).send({mensaje: 'Debe llenar los datos'})
        }

    }else{
        return res.status(500).send({mensaje: 'No posee los permisos necesarios para hacer esta acción'});
    }

}
 


function editarHotel(req, res) {
    var idHotel = req.params.idHotel;
    var params = req.body;


    if(req.user.rol != "ROL_ADMIN"){
        return res.status(500).send({ mensaje: "Solo el administrador de la aplicacion puede editar hoteles" })
    }

    Hotel.findByIdAndUpdate(idHotel, params, { new: true }, (err, hotelActualizado) => {
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if(!hotelActualizado) return res.status(500).send({ mensaje: 'No se ha podido actualizar al Usuario' });
        return res.status(200).send({ hotelActualizado });
    })
}


function eliminarHotel(req, res) {
    var idHotel = req.params.idHotel;

    if(req.user.rol != 'ROL_ADMIN'){
        return res.status(500).send({mensaje: 'Solo el administrador de la aplicacion puede eliminar Hoteles'})
    }

    Hotel.findByIdAndDelete(idHotel, (err, hotelEliminado)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion de Eliminar' });
        if(!hotelEliminado) return res.status(500).send({ mensaje: 'Error al eliminar el usuario.' });

        return res.status(200).send({ hotelEliminado });
    })
}

 function registrarHabitacion(req,res) {
    var idHabitacion = req.params.idHabitacion;
    var params = req.body;

    if(req.user.rol == 'ROL_ADMIN' || 
       req.user.rol =='ROL_GERENTE'){

        Hotel.findOneAndUpdate(idHabitacion,{$push: {habitaciones:{numeroHabitacion: params.idHabitacion, nombreHabitacion: params.nombreHabitacion, precio: params.precio}}},
            {new: true}, (err,habitacionRegistrada)=>{
                if(err) return res.status(500).send({mensaje: 'Error en la petición de las habitacione'});
                if(!habitacionRegistrada) return res.status(500).send({mensaje: 'Error al guardar habitcacion'});
                return res.status(500).send({habitacionRegistrada});
            })
    }else{
        return res.status(500).send({mensaje: 'Unicamente los administradores y los gerentes pueden agregar habitaciones'})
    }
} 

    // Corregir
    function editarHab(req,res) {

    var hotelId = req.params.idHotel;
    var habitacionId = req.params.idHabitacion;
    var params = req.body;

    if(req.user.rol == 'ROL_ADMIN' || req.user.rol =='ROL_GERENTE'){

        Hotel.findByIdAndUpdate({_id: hotelId, "habitaciones._id": habitacionId},
        {"habitaciones.$.nombreHotel": params.nombreHotel, "habitaciones.$.descripcion": params.descripcion, "habitaciones.$.precio": params.precio},
        {new: true, useFindAndModify: false}, (err,habitacionEditada)=>{
    
            if(err) return res.status(500).send({mensaje: 'Error en la petición de habitaciones'});
            if(!habitacionEditada) return res.status(500).send({mensaje: 'Error al editar la habitacion'});
    
            return res.status(500).send({habitacionEditada});
    
        })

    }else{
        return res.status(500).send({mensaje: 'No posee los permisos necesarios para realizar esta acción'});
    }

}
 

// Eliminar habitacion "Pendiente"




function obtenerHoteles(req,res) {

    Hotel.find((err,hotelesEncontrados)=>{

        if(err) return res.status(500).send({mensaje: 'Error al hacer la peticion'});
        if(!hotelesEncontrados) return res.status(500).send({mensaje: 'Error al buscar los hoteles'})

        return res.status(200).send({hotelesEncontrados});
    })
    
}

function obtenerHotelesGerente(req,res) {
    
    if(req.user.rol =='ROL_GERENTE'){

        Hotel.find({idGerente: req.user.sub},(err,hotelesEncontrados)=>{

            if(err) return res.status(500).send({mensaje: 'Error en la petición de los hoteles'});
            if(!hotelesEncontrados) return res.status(500).send({mensaje: 'Error al mostrar la peticion los hoteles'});

            return res.status(200).send({hotelesEncontrados});

        })

    }else{
        return res.status(500).send({mensaje: 'Unicamente los gerentes pueden obtener los hoteles'});
    }

}


module.exports={
    nuevoHotel,
    editarHotel,
    eliminarHotel,
    registrarHabitacion,
    editarHab,
    obtenerHotelesGerente,
    obtenerHoteles
    
}