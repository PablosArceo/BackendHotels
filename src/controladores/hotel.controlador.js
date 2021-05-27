'use strict'

const Usuario = require('../modelos/usuario.model');
const bcrypt = require("bcrypt-nodejs");
const Hotel = require('../modelos/hotel.model');
const jwt = require('../servicios/jwt');


  // ============ Administrador Aplicacion =================
/*    function nuevoHotel(req,res){

    var params = req.body;
    let hotelModel = new Hotel();

    if(req.user.rol != "ROL_ADMIN"){
        return res.status(500).send({ mensaje: "Solo el administrador puede registrar Hoteles" })
    }
    
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


}  
 */

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

                    Usuario.findOne({usuario:params.idGerente},(err,usuarioEncontrado)=>{

                            if(!usuarioEncontrado) return res.status(500).send({mensaje: 'El usuario no existe'});  

                            hotelModel.nombreHotel = params.nombreHotel;
//                            hotelModel.descripcion = params.descripcion;
  //                          hotelModel.imagen = params.imagen;
                            hotelModel.idGerente = usuarioEncontrado._id;

                            hotelModel.save((err,hotelGuardado)=>{
                                if(err) return res.status(500).send({mensaje: 'Error al guardar el hotel', err});
                        
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


/* 
  function nuevoHotel  (req, res) {
    var hotel = new Hotel();
    var idGerente = req.params.idGerente;
    var params = req.body;
  
    if (req.user.rol === 'ROL_ADMIN') {
      if (params.nombreHotel && params.direccion) {
        hotel.nombreHotel = params.nombreHotel;
        hotel.direccion = params.direccion;
        hotel.idGerente = idGerente;
        Usuario.findById(idGerente, (err, usuarioEncontrado) => {

          if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
          if (usuarioEncontrado.rol != 'ROL_GERENTE')
            return res.status(404).send({ message: 'El gerente ya se encuentra registrado con otro hotel' });
        });
  
        Hotel.find({
            idGerente: idGerente,
        }).exec((err, hotelEncontrado) => {
          if(err) return res.status(404).send({mensaje: 'Error en la peticion'});
          if(hotelEncontrado && hotelEncontrado.length >= 1) return res.status(404).send({mensaje: 'Hotel ya registrado'});
          Hotel.find({
            $and: [{ nombreHotel: hotel.nombreHotel, direccion: hotel.direccion }],
          }).exec((err, hotelGuardado) => {
            if (err)
              return res.status(404).send({ mensaje: 'Error en la peticion' });
            if (hotelGuardado && hotelGuardado.length == 1) {
              return res.status(404).send({ mensaje: 'Error al guardar hotel' });
            } else {
              hotel.save((err, hotelGuardado) => {
                if (err)
                  return res.status(404).send({ mensaje: 'Error al guardar el hotel' });
  
                if (hotelGuardado) {
                  return res.status(200).send(hotelGuardado);
                } else {
                  return res.status(404).send({ mensaje: 'No se ha podido guardar el hotel' });
                }
              });
            }
          });
        }) 
      } else {
        return res.status(404).send({ mensaje: 'Error en la peticion' });
      }
    } else {
      return res.status(404).send({ mensaje: 'Error en la peticion' });
    }
}  
 */
 
 
function editarHotel(req, res) {
    var idHotel = req.params.idHotel;
    var params = req.body;


    if(req.user.rol != "ROL_ADMIN"){
        return res.status(500).send({ mensaje: "Solo el administrador de la aplicacion puede editar hoteles" })
    }

    Hotel.findByIdAndUpdate(idHotel, params, { new: true }, (err, hotelActualizado) => {
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if(!hotelActualizado) return res.status(500).send({ mensaje: 'No se ha podido actualizar el hotel' });
        return res.status(200).send({ hotelActualizado });
    })
}


function editarHotelGerente(req,res) {
    var idHotel = req.params.idHotel;
    var params = req.body;

    
    if(req.user.rol != "ROL_GERENTE"){
        return res.status(500).send({ mensaje: "Solo los gerentes  puede editar hoteles" })
    }


    Hotel.findById(idHotel,(err,hotelEncontrado)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la petición del hotel'});
        
        if(req.user.sub == hotelEncontrado.idGerente){
            
            Hotel.findByIdAndUpdate(idHotel,params,{new: true},(err,hotelActualizado)=>{
                if(err) return res.status(500).send({mensaje: 'Error en la petición de Hotel'});
                if(!hotelActualizado) return res.status(500).send({mensaje: 'Error al actualizar el hotel'});
                return res.status(200).send({hotelActualizado});
            })
        
        }else{
            return res.status(500).send({mensaje: 'No posee los permisos necesarios para realizar esta acción'})
        }

    })
}


function eliminarHotelGerente(req,res) {
    var idHotel = req.params.idHotel;
    var params = req.body;

    
    if(req.user.rol != "ROL_GERENTE"){
        return res.status(500).send({ mensaje: "Solo los gerentes pueden eliminar  hoteles" })
    }


    Hotel.findById(idHotel,(err,hotelEncontrado)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la petición del hotel'});
        
        if(req.user.sub == hotelEncontrado.idGerente){
            
           
            Hotel.findByIdAndDelete(idHotel, (err, hotelEliminado)=>{
                if(err) return res.status(500).send({ mensaje: 'Error en la peticion de Eliminar' });
                if(!hotelEliminado) return res.status(500).send({ mensaje: 'Error al eliminar el usuario.' });

                return res.status(200).send({ hotelEliminado });
            })
        
        }else{
            return res.status(500).send({mensaje: 'No posee los permisos necesarios para realizar esta acción'})
        }

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

 




function obtenerHoteles(req,res) {

    Hotel.find((err,hotelesEncontrados)=>{


        if(err) return res.status(500).send({mensaje: 'Error al hacer la peticion'});
        if(!hotelesEncontrados) return res.status(500).send({mensaje: 'Error al buscar los hoteles'})

        return res.status(200).send({hotelesEncontrados});
    })
    
}



function obtenerHotelID(req, res) {
    var idHotel = req.params.idHotel
    
 

    
    Hotel.findById(idHotel, (err, hotelEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion del hotel' })
        if (!hotelEncontrado) return res.status(500).send({ mensaje: 'Error en obtener los datos del hotel' })
        return res.status(200).send({ hotelEncontrado })
    })
}

function obtenerNombreHotel(req, res){
    var nombreHotel = req.params.nombreHotel;
    if (req.user.rol != 'ROL_CLIENTE') return res.status(500).send({mensaje:'Inicia Sesion Como Cliente para Buscar Productos por nombre'})

    Hotel.find({ nombreHotel: nombreHotel}, (err, hotelEncontrado) => {
        if (err) return res.status(500).send({ mensaje: "Error en peticion" });
        if (!hotelEncontrado) return res.status(500).send({ mensaje: "Error en la busqueda de nombre" });
        return res.status(200).send({ hotelEncontrado });
    })
}





function obtenerHotelesGerente(req,res) {
    
    if (req.user.rol != 'ROL_GERENTE') return res.status(500).send({mensaje: 'Unicamente los gerentes pueden adquirir sus hoteles'})

    Hotel.find({idGerente: req.user.sub},(err,hotelesEncontrados)=>{

        if(err) return res.status(500).send({mensaje: 'Error en la petición de los hoteles'});
        if(!hotelesEncontrados) return res.status(500).send({mensaje: 'Error al mostrar la peticion los hoteles'});

         return res.status(200).send({hotelesEncontrados});
        })   
}


module.exports={
    nuevoHotel,
    editarHotel,
    eliminarHotel,
    obtenerHotelesGerente,
    obtenerHoteles,
    obtenerHotelID,
    editarHotelGerente,
    eliminarHotelGerente,
    obtenerNombreHotel
    
}