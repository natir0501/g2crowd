var mongoose = require('mongoose')

var FechaSchema = mongoose.Schema({
    numeroFecha: {
        type: Number
    },
    fechaEncuentro: {
        type: Number,
        required: true
    },
    rueda:{
        type: String,
        required: true
    },
    partido: {
        rival:{
            type: String,
            required:true
        },
        golesPropios:{
            type: Number
        },
        golesRival:{
            type: Number
        },
        local:{
            type: Boolean,
            required: true
        },
        lugar:{
            nombre:{
                type: String
            },
            direccion:{
                type: String
            },
            linkUbicacion:{
                type: String
            }
        } 
    }
})

var Fecha = mongoose.model('Fecha',FechaSchema)
module.exports = {Fecha}