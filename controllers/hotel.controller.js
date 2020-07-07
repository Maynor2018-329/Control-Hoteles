'use strict'

var Hotel = require('../models/hotel.model');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt.hotel');

function saveHotel(req, res){
    var hotel = new Hotel();
    var params = req.body;

    if(params.name && params.location &&
        params.email && params.password && params.initialDate && params.finalDate){
            Hotel.findOne({$or: [{name: params.name}, {email: params.email}]}, (err, hotelFind)=>{
                if(err){
                    res.status(500).send({message: 'Error General'});
                }else if(hotelFind){
                    res.send({message: 'Nombre o Correo ya utilizado'});
                }else{
                    hotel.name = params.name;
                    hotel.location = params.location;
                    hotel.email = params.email;
                    hotel.precio = params.precio;
                    hotel.fecha = params.fecha;
                    hotel.stars = params.stars;
                    hotel.availability.initialDate = params.initialDate;
                    hotel.availability.finalDate = params.finalDate;
                    hotel.role = 'ADMIN';

                    bcrypt.hash(params.password, null, null,(err, cript)=>{
                        if(err){
                            res.status(500).send({message:'Error al encriptar contraseña'});
                        }else if(cript){
                            hotel.password = cript;

                            hotel.save((err, hotelSaved)=>{
                                if(err){
                                    res.status(500).send({message: 'Error general'});
                                }else if(hotelSaved){
                                    res.send({message: 'Hotel Creado con exito', hotel : hotelSaved});
                                }else{
                                    res.status(404).send({message: 'Error al Crear Hotel'});
                                }
                            });
                        }else{
                            res.status(418).send({message: 'Error'});
                        }
                    });
                }
            });
        }else{
            res.send({message: 'Ingrese los campos requeridos'});
        }
}



function loginHotel(req, res){
    var params = req.body;

    if(params.name || params.email){
        if(params.password){
            Hotel.findOne({$or: [{name: params.name}, {email: params.email}]},(err, check)=>{
                if(err){
                    res.status(500).send({message: 'error general'});
                }else if(check){
                    bcrypt.compare(params.password, check.password,(err, passOk)=>{
                        if(err){
                            res.status(500).send({message: 'Error'});
                        }else if(passOk){
                            if(params.gettoken = true){
                                res.send({token: jwt.createTokenHotel(check)});
                            }else{
                                res.send({message: 'Bienvenido', hotel: check});
                            }
                        }else{
                            res.send({message: 'Contraseña incorrecta'});
                        }
                    });
                }else{
                    res.send({message: 'Datos de hotel invalidos'});
                }
            });
        }else{
            res.send({message: 'Ingresa tu contraseña '});
        }
    }else{
        res.send({message: 'Ingrese un correo o nombre '})
    }
}

function updateHotel(req, res){
    var hotelId = req.params.id;
    var update = req.body;

    if(hotelId != req.hotel.sub){
        res.status(500).send({message: 'No tiene permiso para realizar este cambio'});
    }else{
        Hotel.findByIdAndUpdate(hotelId, update, {new: true},(err, hotelUpdated)=>{
            if(err){
                res.status(500).send({message: 'Error en el sistema'});
            }else if(hotelUpdated){
                res.send({message: 'Hotel Actualizado con exito',  hotel: hotelUpdated});
            }else{
                res.status(404).send({message: 'No se ha podido actualizar el hotel'});
            }           
        });
    }
}

function listHotel(req, res){
    Hotel.find({}, (err, hotels)=>{
        if(err){
            res.status(500).send({message: 'Error General'});
        }else if(hotels){
            res.send({message: 'Lista de Hoteles Existentes', hotel: hotels});
        }else{
            res.send({message: 'No hay datos que mostrar'});
        }
    });
}


function removeHotel(req, res){
    let hotelId = req.params.id;

    if(hotelId != req.hotel.sub){
        res.status(403).send({message: 'No tiene permiso para realizar esta accion'});
    }else{
        Hotel.findByIdAndRemove(hotelId, (err, hotelRemoved)=>{
            if(err){
                res.status(500).send({message: 'Error General'});
            }else if(hotelRemoved){
                res.send({message: 'Se a eliminado con Exito el Hotel: ', hotel: hotelRemoved});
            }else{
                res.send({message: 'Error al Eliminar el Hotel'});
            }
        });
    }
}


//BUSQUEDA DE ESTRELLAS
function findStars(req, res){

    const coincidence = req.body.search;
    var id = req.params.id;

        if(id){
            res.status(500).send({message: 'Error en el sistema'});
        }else if(coincidence){
            Hotel.find({$or:[{'stars':{$regex: coincidence,$options:'i'}}]},(err, starsFind) => {
        if(err){
            res.status(500).send({message: 'Error general'});
        }else if(starsFind){
            res.status(200).send({hotel: starsFind});
        }else{
            res.status(200).send({message: 'No se encontraron coincidencias'});
        }
    });
        }else{
            res.send({message: 'No hay datos que mostrar'});
    }
}

//BUSQUEDA EN ORDEN ALFABETICO
function hotelApha(req, res){
    Hotel.find((err, hotelApha)=>{
        if(err){
            res.status(500).send({message: 'Error en el sistema'});
        }else if(hotelApha){
            res.send({message: 'Hoteles en Orden Alfabetico', hotel: hotelApha});
        }else{
            res.status(404).send({message: 'Error en la peticion'});
        }
    }).sort({name:1});
}

//BUSQUEDA DE PRECIO MAYOR - MENOR
function hotelPrecioHigh(req, res){
    Hotel.find((err, hotelPrecio)=>{
        if(err){
            res.status(500).send({message: 'Error en el sistema'});
        }else if(hotelPrecio){
            res.send({message: 'Hoteles en Orden de Precio Mayor a Menor', hotel: hotelPrecio});
        }else{
            res.status(404).send({message: 'Error en la peticion'});
        }
    }).sort({precio:-1});
}

//BUSQUEDA DE PRECIO MENOR - MAYOR
function hotelPrecioLess(req, res){
    Hotel.find((err, hotelPrecio)=>{
        if(err){
            res.status(500).send({message: 'Error en el sistema'});
        }else if(hotelPrecio){
            res.send({message: 'Hoteles en Orden de Precio Menor a Mayor', hotel: hotelPrecio});
        }else{
            res.status(404).send({message: 'Error en la peticion'});
        }
    }).sort({precio:1});
}

//BUSQUEDA DE FECHA
function listDate(req, res){
    var params = req.body;

    Hotel.find({initialDate: {"$gte": new String(params.initialDate), "$lt": new String(params.finalDate)}}, (err, find)=>{
        if(err){
            res.status(500).send({message: 'Error general'});
        }else if(find){
            res.send({message: 'Hoteles en ese rango de fecha', hotels: find})
        }else{
            res.status(404).send({message: 'No se encontro ningun hotel en esas fechas'});
        }
    });
}



module.exports = {
    saveHotel,
    loginHotel,
    updateHotel,
    removeHotel,
    listHotel,
    findStars,
    hotelApha,
    hotelPrecioHigh,
    hotelPrecioLess,
    listDate
}