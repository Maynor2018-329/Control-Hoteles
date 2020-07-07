'use strict'

var express = require('express');
var hotelController = require('../controllers/hotel.controller');
var api = express.Router();
var mdAuth = require('../middlewares/authenticated');


api.post('/saveHotel', hotelController.saveHotel);
api.post('/loginHotel', hotelController.loginHotel);

// -----------------------------------------------------------------------------
//RUTAS DE ELIMINAR, EDITAR Y LISTAR HOTEL CON AUTENTICACION DE HOTEL
api.put('/updateHotel/:id',mdAuth.ensureAuthHotel,hotelController.updateHotel);
api.delete('/removeHotel/:id',mdAuth.ensureAuthHotel, hotelController.removeHotel);
api.get('/listHotel',mdAuth.ensureAuthHotel,hotelController.listHotel);
// -----------------------------------------------------------------------------


// -----------------------------------------------------------------------------
//RUTAS DE BUSQUEDA DE ESTRELLAS, PRECIO , ORDEN ALFABETICO Y FECHA CON AUTENTICACION DE USUARIO
//OBTENER HOTELES CON NUMERO DE ESTRELLAS
api.get('/findStars',mdAuth.ensureAuthUsuario ,hotelController.findStars);
// OBTENER DATOS EN ORDEN ALFABETICO
api.get('/hotelAlpha', mdAuth.ensureAuthUsuario ,hotelController.hotelApha);
// OBTENER DATOS EN ORDEN DE PRECIO MAYOR 
api.get('/hotelPriceHigh', mdAuth.ensureAuthUsuario ,hotelController.hotelPrecioHigh);
// OBTENER PRECIO EN ORDEN MENOR
api.get('/hotelPriceLess', mdAuth.ensureAuthUsuario ,hotelController.hotelPrecioLess);
// OBTENER DATOS EN ORDEN DE FECHA
api.get('/listDate', mdAuth.ensureAuthUsuario ,hotelController.listDate);
// -----------------------------------------------------------------------------

module.exports = api;