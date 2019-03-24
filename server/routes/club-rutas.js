var express = require('express');
var api= express.Router();
const {Club} = require('../models/club')
const { Usuario } = require('../models/usuario')
const {ApiResponse} = require('../models/api-response')
const _ = require('lodash')

api.post('/club', async (req,res) =>{
    
    try{
        var club = new Club(_.pick(req.body,['nombre','telContacto','direccion','email','deportes','avatar','colores']))
        //Creo el usuario administradro como delegado institucional
        let usuario = new Usuario({ 'email': req.body.email, 'delegadoInstitucional': true })
        await usuario.generateAuthToken()
        usuario = await usuario.save()
        await usuario.enviarConfirmacionAlta()      
        //Si todo salio bien guardo el club  
        await club.save()
        res.status(200).send(new ApiResponse({club},'Agregado Ok.'));
    }catch(e){
        console.log(e);
        res.status(400).send(new ApiResponse({},"No se pudo agregar el club."))
    }
})

module.exports=api;