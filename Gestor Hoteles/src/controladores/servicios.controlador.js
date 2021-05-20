'use strict'

const Hotel = require('../modelos/hotel.model');
const Servicio = require('../modelos/servicios.model');

 function crearServicio(req,res) {
    
    var params= req.body;
    var servicioModel = new Servicio();

    if(req.user.rol == 'ROL_GERENTE'){

        if(params.nombreServicio && params.precio && params.idHotel){
            servicioModel.nombreServicio = params.nombreServicio;
            servicioModel.precio = params.precio;
            servicioModel.idHotel = params.idHotel;

            Servicio.find({$or: [
                {nombreServicio: servicioModel.nombreServicio},
            ]}).exec((err,serviciosEncontrados)=>{
                if(serviciosEncontrados && serviciosEncontrados.length>=1){
                    return res.status(500).send({mensaje: 'El servicio ya se encuentra registrado'})
                }else{
                    Hotel.findById(params.idHotel,(err,hotelEncontrado)=>{  
                        if(err) return res.status(500).send({mensaje: 'Error en la petición del hotel ingresado'});
                        if(!hotelEncontrado) return res.status(500).send({mensaje: 'El hotel no se encuentra en la base de datos '});
                        servicioModel.save((err,servicioGuardado)=>{
                            if(err) return res.status(500).send({mensaje: 'Error en la petición del servicio'});
                            if(servicioGuardado){
                                return res.status(200).send({servicioGuardado});
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


function editarServicio(req,res) {
    
        var params = req.body;
        var idServicio = req.params.idServicio;

        if (req.user.rol != 'ROL_GERENTE') return res.status(500).send({mensaje: 'Unicamente los gerentes pueden eliminar servicios'})
        
        Servicio.findByIdAndUpdate(idServicio,params,{new: true, useFindAndModify: false},(err,servicioActualizado)=>{
    
        if(err) return res.status(500).send({mensaje: 'Error en la petición del servicio'});
        if(!servicioActualizado) return res.status(500).send({mensaje: 'Error al actualizar el Servicio seleccionado'});
    
        return res.status(200).send({servicioActualizado});
    
        })
       

}

function eliminarServicio(req,res) {
    
        var idServicio = req.params.idServicio;
        var params = req.body;
     
        if (req.user.rol != 'ROL_GERENTE') return res.status(500).send({mensaje: 'Unicamente los gerentes pueden eliminar servicios'})
     
        Servicio.findByIdAndDelete(idServicio, (err, servicioEliminado)=>{
     
        if(err) return res.status(500).send({mensaje: 'Error en la peticion de servicios'});
        if(!servicioEliminado) return res.status(500).send({mensaje: 'Error en la peticion de eliminar el servicio'});
        return res.status(500).send({servicioEliminado});   
        });
     

}
     
        
module.exports ={
    crearServicio,
    editarServicio,
    eliminarServicio

} 