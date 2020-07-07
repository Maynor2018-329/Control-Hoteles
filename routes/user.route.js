'use strict'

var express = require('express');
var userController = require('../controllers/user.controller');
var api = express.Router();
var mdAuth = require('../middlewares/authenticated');


api.post('/saveUser', userController.saveUser);
api.post('/loginUser', userController.loginUser);
api.put('/updateUser/:id',mdAuth.ensureAuthUsuario,userController.updateUser);
api.delete('/removeUser/:id', mdAuth.ensureAuthUsuario,userController.removeUser);
api.get('/listUser', mdAuth.ensureAuthAdmin,userController.listUser);

module.exports = api;