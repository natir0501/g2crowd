var mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')

var RolSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    codigo: {
        type: String,
        required: true,
        minlength:3,
        trim: true,
        unique: true
    }

})

RolSchema.plugin(uniqueValidator);

var Rol = mongoose.model('Rol',RolSchema)
module.exports = {Rol}
