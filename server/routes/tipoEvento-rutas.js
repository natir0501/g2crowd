var express = require('express');
var api= express.Router();
const {TipoEvento}=require('../models/tipoEvento')
const _ = require('lodash')
const {ObjectID} = require('mongodb')
const {ApiResponse} = require('../models/api-response')

api.get('/tipoeventos',(req, res)=>{
    
    TipoEvento.find()
    .then((tipoEventos)=>{
        res.send(new ApiResponse({tipoEventos},''))
    }),(e)=>{
        res.status(400).send(e)
    }
})

api.post('/tipoeventos', async (req,res) =>{
    
    try{
        var tipoEvento = new TipoEvento(_.pick(req.body,['nombre','datosDeportivos']))
        await tipoEvento.save()
       
        res.status(200).send(new ApiResponse({tipoEvento},'Agregado Ok'));
    }catch(e){
        res.status(400).send(new ApiResponse({},"No se pudo agregar el tipo de evento."))
    }
})


api.get('/tipoeventos/:id', async (req,res)=>{
    var id = req.params.id;
    
    if(!ObjectID.isValid(id)){
        res.status(404).send(new ApiResponse({},"Código de Id inválido."))
    }

    TipoEvento.findOne({
        _id: id
    }).then((tipoEvento)=> {
        if(tipoEvento){
            res.status(200).send(new ApiResponse({tipoEvento},''))
        }else{
            res.status(404).send(new ApiResponse({},"No hay datos para mostrar."))
        }
    }).catch((e)=>{
        res.status(400).send(new ApiResponse({},"Error"))
    })    
})

api.put('/tipoeventos/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['nombre','datosDeportivos']);

    TipoEvento.findOneAndUpdate({
        _id: id
    }, {
            $set: body
        }, {
            new: true
        }).then((tipoEvento) => {
            if (tipoEvento) {
                res.status(200).send(new ApiResponse({tipoEvento},'Actualizado OK.'));
            } else {
                res.status(404).send(new ApiResponse({},"No se encontró un evento para modificar."))
            }
        }).catch((e) => {
            res.status(400).send(new ApiResponse({},"Error"))
        })
})


module.exports=api;