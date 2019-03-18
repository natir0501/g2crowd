var express = require('express');
var api = express.Router();
const { Pantalla } = require('../models/pantalla')
const _ = require('lodash')
const { ApiResponse } = require('../models/api-response')
const { ObjectID } = require('mongodb')



api.post('/pantallas', async (req, res) => {

    try {
        const rolesStr = req.body.roles
        let roles = []
        for (let i = 0; i<rolesStr.length; i++) {
            roles.push(ObjectID(rolesStr[i]))
        }

        
        const pantallas = await Pantalla.find({ 'roles': { $in: roles } })
        if(pantallas){




            return res.send(new ApiResponse(pantallas,''))
        }
        res.status(400).send(new ApiResponse({},'Error'))
    }
    catch(e){
        res.status(400).send(new ApiResponse({},e))
    }
})


module.exports = api;