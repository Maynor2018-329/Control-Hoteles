'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var keyHotel = 'clave_secreta_hotel';

exports.createTokenHotel = (hotel)=>{
    var payload = {
        sub: hotel._id,
        name : hotel.name,
        location: hotel.location,
        email: hotel.email,
        precio: hotel.precio,
        role: hotel.role,
        iat :moment().unix(),
        exp: moment().add(15, "minutes").unix()
    }
    return jwt.encode(payload, keyHotel);
}