'use strict'

var mongoose = require('mongoose');
var port = 3800;
var app = require('./app');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/ControlHotel', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
.then(()=>{
    console.log('Conexion Exitosa');
    app.listen(port, ()=>{
        console.log('Servidor de Express corriendo', port);
    });
}).catch(err =>{
    console.log('Error al conectarse');
})