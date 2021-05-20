  
'use strict'

const Evento = require('../modelos/evento.model');
const TipoEvento = require('../modelos/tipoEvento.model');
const jwt = require("../servicios/jwt");


function crearTipoEvento(req,res) {

    var params = req.body;
    let tipoEventoModel = new TipoEvento();

    if(req.user.rol == 'ROL_ADMIN'){

        if(params.nombreTipoEvento){

            tipoEventoModel.nombreTipoEvento = params.nombreTipoEvento;

            TipoEvento.find({$or: [
                {nombreTipoEvento: tipoEventoModel.nombreTipoEvento}
            ]}).exec((err,tipoEventoEncontrado)=>{
                
                if(tipoEventoEncontrado && tipoEventoEncontrado.length>=1){
                    
                    return res.status(500).send({mensaje: 'El tipo de evento ya se encuentra registrado'});
    
                }else{
    
                    tipoEventoModel.save((err,tipoEventoGuardado)=>{
                        
                        if(err) return res.status(500).send({mensaje: 'Error en la peticion al guardar el tipo de evento'});
    
                        if(tipoEventoGuardado){
                            return res.status(200).send({tipoEventoGuardado});
                        }
    
                    })
    
                }
    
            })

        }else{
            return res.status(200).send({mensaje: 'Debe llenar los datos'});
        }

    }else{
        return res.status(500).send({mensaje: 'Unicamento los administradores pueden registrar tipos de eventos'})
    }
    
}

function editarTipoEvento(req,res) {

    var params = req.body;
    var idTipoEvento = req.params.idTipoEvento;

    if(req.user.rol == 'ROL_ADMIN'){

        TipoEvento.findByIdAndUpdate(idTipoEvento,params,{new: true, useFindAndModify: false},(err,tipoEventoActualizado)=>{

            if(err) return res.status(500).send({mensaje: 'Error en la petición'});
            if(!tipoEventoActualizado) return res.status(500).send({msanaje: 'Error al actualizar el tipo de Evento'});
    
            return res.status(200).send({tipoEventoActualizado});
    
        })

    }else{
        return res.status(500).send({mensaje: 'Unicamente los administradores pueden modificar los tipo de eventos'});
    }
    
}

function eliminarTipoEvento(req,res) {
    
    var idTipoEvento = req.params.idTipoEvento;
    if(req.user.rol == 'ROL_ADMIN'){

        TipoEvento.findByIdAndDelete(idTipoEvento,(err,tipoEventoEliminado)=>{
            
        if(err) return res.status(500).send({mensaje: 'Error en la petición'});
        if(!tipoEventoEliminado) return res.status(500).send({mensaje: 'Error al eliminar el tipo Evento'});

        return res.status(200).send({tipoEventoEliminado});

        })

    }else{
        return res.status(500).send({mensaje: 'Unicamente los administradores pueden eliminar los tipos de evento'});
    }

}

function obtenerTipoEvento(req,res) {
    
    TipoEvento.find((err,tiposEventoEncontrados)=>{

        if(err) return res.status(500).send({mensaje: 'Error en la petición'});
        if(!tiposEventoEncontrados) return res.status(500).send({mensaje: 'Error al visualizar los tipos Evento'});

        return res.status(200).send({tiposEventoEncontrados});

    })

}



module.exports ={
    crearTipoEvento,
    editarTipoEvento,
    eliminarTipoEvento,
    obtenerTipoEvento
}