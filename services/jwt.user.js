'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var keyUser = 'clave_secreta_usuario';

exports.createTokenUser = (user)=>{
    var payload = {
        sub: user._id,
        name: user.name,
        username: user.username,
        role: user.role,
        email: user.email,
        iat: moment().unix(),
        exp: moment().add(15, "minutes").unix
    }
    return jwt.encode(payload, keyUser);
}