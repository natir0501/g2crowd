var mongoose = require('mongoose')
const validator = require('validator')
var uniqueValidator = require('mongoose-unique-validator')

var ClubSchema = mongoose.Schema({
    nombre: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    telContacto: {
        type: String,
        validate: {
            validator: validator.isNumeric,
            message: '{VALUE} No es un teléfono válido'
        }
    },
    direccion: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} No es un email válido.'
        }
    },
    deportes: [{
        type: String,
    }],
    avatar: {
        type: String,
        required: true
    },
    colores: [{
        type: String
    }],
    activo:{
        type: Boolean,
        default: false
    }

})

ClubSchema.plugin(uniqueValidator);

var Club = mongoose.model('Club',ClubSchema)
module.exports = {Club}