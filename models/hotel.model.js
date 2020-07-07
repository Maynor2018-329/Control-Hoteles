'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var hotelSchema = Schema({
    name: String,
    location: String,
    email: String,
    password: String,
    precio: Number,
    fecha: String,
    stars: String,
    role: String,
    availability: {
        initialDate : String,
        finalDate: String,
    }
});

module.exports = mongoose.model('hotel', hotelSchema);