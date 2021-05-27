'use strict'

const Hotel = require('../modelos/hotel.model');
const Reservacion = require('../modelos/reservacion.model');
const Factura = require('../modelos/factura.model');
const Servicio = require('../modelos/servicios.model');
const Habitacion = require('../modelos/habitacion.model');






/* function registrarFactura(req,res) {
    var idReservacion = req.params.idReservacion

    var params = req.body;
    let factura = new Factura();

    if(req.user.rol == 'ROL_GERENTE'){

        if(params.fecha_llegada && params.fecha_salida){

            factura.fecha_llegada = params.fecha_llegada;
            factura.fecha_salida = params.echa_salida;
            factura.precio= params.precio;
         

            
            Factura.find({$or: [
                {fecha_llegada: factura.fecha_llegada}
            ]}).exec((err,facturaEncontrada)=>{
                
                if(facturaEncontrada && facturaEncontrada.length>=1){
                    
                    return res.status(500).send({mensaje: 'la factura ya se encuentra registrada ya se encuentra registrado'});
    
                }else{
    
                    factura.save((err,facturaGuardada)=>{
                        
                        if(err) return res.status(500).send({mensaje: 'Error en la peticion al guardar el tipo de evento'});
    
                        if(facturaGuardada){
                            return res.status(200).send({facturaGuardada});
                        }
    
                    })
    
                }
    
            })

        }else{
            return res.status(200).send({mensaje: 'Debe llenar los datos'});
        }

    }else{
        return res.status(500).send({mensaje: 'Unicamento los administradores pueden registrar facturas'})
    }
    
} */

function registrarFactura(req,res) {
    var facturaModel = new Factura();
    var params = req.body;

    if (params.fecha_llegada && params.fecha_salida && params.precio) {
        facturaModel.fecha_llegada = params.fecha_llegada;
        facturaModel.fecha_salida = params.fecha_salida;
        facturaModel.precio = params.precio;


        facturaModel.save((err,facturaGuardada)=>{
                        if (err) return res.status(500).send({mensaje: 'Error al guardar el alumno'}) 
                            
                        if (facturaGuardada) {
                            res.status(200).send(facturaGuardada)    
                        }else{
                            res.status(404).send({mensaje: 'No se ha podido registrar el alumno'})
                        }
                    })
                

            }
    
    }    




function obtenerFactura(req,res) {
    
    Factura.find((err,facturaEncontrada)=>{

        if(err) return res.status(500).send({mensaje: 'Error en la petición'});
        if(!facturaEncontrada) return res.status(500).send({mensaje: 'Error al visualizar los tipos Evento'});

        return res.status(200).send({facturaEncontrada});

    })

}


module.exports ={
    registrarFactura,
    obtenerFactura
}