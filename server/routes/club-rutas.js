var express = require('express');
var api= express.Router();
const {Club} = require('../models/club')
const { Usuario } = require('../models/usuario')
const {ApiResponse} = require('../models/api-response')
const _ = require('lodash')


api.post('/club', async (req,res) =>{
    var club = new Club(_.pick(req.body,['nombre','telContacto','direccion','emailAdmin','deportes','avatar','colores']))
    let usuario = new Usuario({ 'email': req.body.emailAdmin, 'delegadoInstitucional': true })
    var file = fileLoader.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);
    try{       
        //Creo el usuario administradro como delegado institucional
        
        usuario.generateAuthToken()
        club.avatar = reader.result;
        //Si todo salio bien guardo el club  
        await club.save()
    
        //Si pude dar de alta el club doy de alta el usuario        
        usuario = await usuario.save()
        await usuario.enviarConfirmacionAlta()  
        
        res.status(200).send(new ApiResponse({club},'Agregado Ok.'));
    }catch(e){
        console.log(e);
        await usuario.delete();
        await club.delete();
        res.status(400).send(new ApiResponse({},"No se pudo agregar el club."))
    }
})

module.exports=api;