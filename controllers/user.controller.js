'use strict'

var User = require('../models/user.model');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt.user');

function saveUser(req, res){
    var user = new User();
    var params = req.body;

    if(params.name && params.username &&
        params.email && params.password){
            User.findOne({$or: [{username: params.username}, {email: params.email}]}, (err, userFind)=>{
                if(err){
                    res.status(500).send({message: 'Error General'});
                }else if(userFind){
                    res.send({message: 'usuario o Correo ya utilizado'});
                }else{
                    user.name = params.name;
                    user.username = params.username;
                    user.email = params.email;
                    user.role = 'USER';

                    bcrypt.hash(params.password, null, null,(err, cript)=>{
                        if(err){
                            res.status(500).send({message:'Error al encriptar contraseña'});
                        }else if(cript){
                            user.password = cript;

                            user.save((err, userSaved)=>{
                                if(err){
                                    res.status(500).send({message: 'Error general'});
                                }else if(userSaved){
                                    res.send({message: 'Usuario Creado con exito', user : userSaved});
                                }else{
                                    res.status(404).send({message: 'Error al Crear Usuario'});
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

function loginUser(req, res){
    var params = req.body;

    if(params.username || params.email){
        if(params.password){
            User.findOne({$or: [{username: params.username}, {email: params.email}]},(err, check)=>{
                if(err){
                    res.status(500).send({message: 'error general'});
                }else if(check){
                    bcrypt.compare(params.password, check.password,(err, passOk)=>{
                        if(err){
                            res.status(500).send({message: 'Error'});
                        }else if(passOk){
                            if(params.gettoken = true){
                                res.send({token: jwt.createTokenUser(check)});
                            }else{
                                res.send({message: 'Bienvenido', user: check});
                            }
                        }else{
                            res.send({message: 'Contraseña incorrecta'});
                        }
                    });
                }else{
                    res.send({message: 'Datos de usuario invalidos'});
                }
            });
        }else{
            res.send({message: 'Ingresa tu contraseña '});
        }
    }else{
        res.send({message: 'Ingrese un correo o usuario '})
    }
}

function updateUser(req, res){
    var userId = req.params.id;
    var update = req.body;

    if(userId != req.user.sub){
        res.status(500).send({message: 'No tiene permiso para realizar este cambio'});
    }else{
        User.findByIdAndUpdate(userId, update, {new: true},(err, userUpdated)=>{
            if(err){
                res.status(500).send({message: 'Error en el sistema'});
            }else if(userUpdated){
                res.send({message: 'Usuario Actualizado con exito',  user: userUpdated});
            }else{
                res.status(404).send({message: 'No se ha podido actualizar el usuario'});
            }           
        });
    }
}

function listUser(req, res){
    User.find({}, (err, users)=>{
        if(err){
            res.status(500).send({message: 'Error General'});
        }else if(users){
            res.send({message: 'Lista de Usuarios Existentes', user: users});
        }else{
            res.send({message: 'No hay datos que mostrar'});
        }
    });
}

function removeUser(req, res){
    let userId = req.params.id;

    if(userId != req.user.sub){
        res.status(403).send({message: 'No tiene permiso para realizar esta accion'});
    }else{
        User.findByIdAndRemove(userId, (err, userRemoved)=>{
            if(err){
                res.status(500).send({message: 'Error General'});
            }else if(userRemoved){
                res.send({message: 'Se a eliminado con Exito el usuario: ', user: userRemoved});
            }else{
                res.send({message: 'Error al Eliminar el usuario'});
            }
        });
    }
}



module.exports = {
    saveUser,
    loginUser,
    updateUser,
    removeUser,
    listUser
}