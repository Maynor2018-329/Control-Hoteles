'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var keyUser = 'clave_secreta_usuario';
var keyHotel = 'clave_secreta_hotel';

//AUTENTICACION DE TIPO USUARIO
exports.ensureAuthUsuario = (req, res, next)=>{
    if(!req.headers.authorization){
        return res.status(403).send({message: 'peticion sin autenticacion'});
    }else{
        var token = req.headers.authorization.replace(/['"]+/g, '');
        try{
            var payload = jwt.decode(token, keyUser );
            if(payload.exp <= moment().unix()){
                return res.status(401).send({message: 'Token Expirado'});
            }
        }catch(ex){
            return res.status(404).send({message: 'Token no valido'});
        }
        req.user = payload;
        next();
    }
};

//AUTENTICACION DE TIPO ADMIN
exports.ensureAuthAdmin = (req, res, next)=>{
    if(!req.headers.authorization){
        return res.status(403).send({message: 'peticion Sin autenticacion'});
    }else{
        var token = req.headers.authorization.replace(/['"]+/g, '');
        try{
            var payload = jwt.decode(token , keyUser);
             if(payload.exp <= moment().unix()){
                return res.status(401).send({message: 'token Expirado'});
            }else if(payload.role != 'ADMIN'){
                return res.status(404).send({message: 'No tienes permiso para Esta ruta'});
            }
        }catch(exp){
            return res.status(404).send({message: 'token no valido'});    
        }
        req.user = payload;
        next();
    }
};

//AUTENTICACION DE TIPO HOTEL
exports.ensureAuthHotel = (req, res, next)=>{
    if(!req.headers.authorization){
        return res.status(403).send({message: 'Peticion sin autenticion'});
    }else{
        var token = req.headers.authorization.replace(/['"]+/g, '');
        try{
            var payload = jwt.decode(token, keyHotel);
            if(payload.exp <= moment().unix()){
                return(res.status(401).send({message: 'token Expirado'}));
            }
        }catch(exp){
            return res.status(404).send({message: 'token no valido'});
        }
        req.hotel = payload;
        next();
    }
}


