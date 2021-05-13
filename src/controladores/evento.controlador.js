'use strict'

const Usuario = require('../modelos/usuario.model');
const Hotel = require('../modelos/hotel.model');
const Evento = require('../modelos/evento.model');
const TipoEvento = require('../modelos/tipoEvento.model');

  // ============ Admin Aplicacion   ============
 
  function registrarEvento(req,res) {

    var params = req.body;
    let eventoModel = new Evento();

    if (req.user.rol != 'ROL_ADMIN') return res.status(500).send({mensaje:'Unicamente los administradores pueden registrar un evento'})

        if(params.nombreEvento && params.fecha){  

        eventoModel.nombreEvento = params.nombreEvento;
        eventoModel.capacidad = params.capacidad;
        eventoModel.fecha = params.fecha;
        eventoModel.idHotel = params.idHotel;
        eventoModel.idtipoEvento = params.idtipoEvento;

        Evento.find({$or: [
        {nombreEvento: eventoModel.nombreEvento}
        ]}).exec((err,eventosEncontrados)=>{

            if(eventosEncontrados && eventosEncontrados.length >=1){
                return res.status(500).send({mensaje: 'El evento ya existe'});
                }else{

                Hotel.findById(params.idHotel,(err,hotelEncontrado)=>{
                    if(err) return res.status(500).send({mensaje: 'Error en la petición del hotel'});
                    if(!hotelEncontrado) return res.status(500).send({mensaje: 'El hotel ingresado no se encuentra registrado'});

                    TipoEvento.findById(params.idtipoEvento,(err,tipoEventoEncontrado)=>{

                    if(err) return res.status(500).send({mensaje: 'Error en la petición del tipo evento'});
                    if(!tipoEventoEncontrado) return res.status(500).send({mensaje: 'El Tipo Evento ingresado no se encuentra registrado'});

                    eventoModel.save((err, eventoGuardado)=>{
                        if(err) return res.status(500).send({mensaje: 'Error en la petición'});
        
                            if(eventoGuardado){
                            return res.status(200).send({eventoGuardado});
                                }
                            })

                        })

                    })

                }

            })

        }else{
            return res.status(500).send({mensaje: 'Por favor ingrese todos los datos'});
        }   
} 

/* function registrarEvento(req, res) {
    if (req.user.rol != 'ROL_ADMIN') return res.status(500).send({ mensaje: 'Solo los administradores pueden registrar' })
    var eventoModel = new Evento();
    var idtipoEvento = req.params.idtipoEvento;
    var idHotel = req.params.idHotel;
    var params = req.body;

    eventoModel.nombreEvento = params.nombreEvento;
    eventoModel.capacidad = params.capacidad;
    eventoModel.fecha = params.fecha;
        eventoModel.hotel = idHotel;

    eventoModel.idtipoEvento = idtipoEvento;

    if (params.evento == '' || params.fecha == '') return res.status(500).send({ mensaje: 'Debe rellenar todos los campos' })
    eventoModel.save((err, eventoGuardado) => {
        if (err) return res.status(500).send({ mensaje: 'Error al ejecutar la peticion' })
        if (!eventoGuardado) return res.status(500).send({ mensaje: 'Error al guardar el Evento' })

        return res.status(200).send({ eventoGuardado })
    })
} */



function editarEvento(req,res) {
    
    var params = req.body;
    var idEvento  = req.params.idEvento;

    if (req.user.rol != 'ROL_ADMIN') return res.status(500).send({mensaje:'Unicamente los administradores pueden editar los eventos'})


    Evento.findByIdAndUpdate(idEvento,params,{new: true, useFindAndModify: false},(err,eventoActualizado)=>{

    if(err) return res.status(500).send({mensaje: 'Error en la petición'});
    if(!eventoActualizado) return res.status(500).send({mensaje: 'Error en la peticion al actualizar el Evento'});
    return res.status(200).send({eventoActualizado});

    })
}

function eliminarEvento(req,res) {
    var params = req.body;    
    var idEvento = req.params.idEvento

    if (req.user.rol != 'ROL_ADMIN') return res.status(500).send({mensaje:'Unicamente los administradores pueden eliminar los eventos'})


    Evento.findByIdAndDelete(idEvento,(err,eventoEliminado)=>{

    if(err) return res.status(500).send({mensaje: 'Error en la petición del evento'});
    if(!eventoEliminado) return res.status(500).send({mensaje: 'Error en la peticion de  eliminar el evento'});
            
    return res.status(200).send({eventoEliminado})

    })
}

  // ============ Libre Acceso   ============


function obtenerEventos(req,res){

    Evento.find((err,eventosEncontrados)=>{

        
        if(err) return res.status(500).send({mensaje: 'Error en la petición de eventos '});
        if(!eventosEncontrados) return res.status(500).send({mensaje: 'Error en la peticion al obtener eventos los eventos'});
        
        return res.status(200).send({eventosEncontrados});

    })

}



// Eventos por Nombre
function obtenerEventosPorNombre(req, res){
    var nombreEvento = req.params.nombreEvento;

    Evento.find({ 'nombreEvento': nombreEvento}, (err, eventoencontrado) => {
        if (err) return res.status(500).send({ mensaje: "Error en peticion de evento" });
        if (!eventoencontrado) return res.status(500).send({ mensaje: "Error en la busqueda de nombre" });
        return res.status(200).send({ eventoencontrado });
    })
}


// Funcion Para buscar Eventos por Hotel
function obtenerEventosPorHotel(req, res){
    var idHotel = req.params.idHotel;

    Evento.find({ 'idHotel': idHotel}, (err, eventoencontrado) => {
        if (err) return res.status(500).send({ mensaje: "Error en peticion de evento" });
        if (!eventoencontrado) return res.status(500).send({ mensaje: "Error en la busqueda de nombre" });
        return res.status(200).send({ eventoencontrado });
    })
}


function obtenerPorTipoEvento(req, res){
    var idHotel = req.params.idHotel;
    var idtipoEvento = req.params.idtipoEvento;

    Evento.find({ 'idHotel': idHotel, 'idtipoEvento': idtipoEvento}, (err, eventoencontrado) => {
        if (err) return res.status(500).send({ mensaje: "Error en peticion de evento" });
        if (!eventoencontrado) return res.status(500).send({ mensaje: "Error en la busqueda por tipo de evento" });
        return res.status(200).send({ eventoencontrado });
    })
}





module.exports={
    registrarEvento,
    editarEvento,
    eliminarEvento,
    obtenerEventos,
    obtenerEventosPorNombre,
    obtenerEventosPorHotel,
    obtenerPorTipoEvento
}