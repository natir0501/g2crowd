var mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')

var PantallaSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
  
    roles: [{
        type: mongoose.Schema.Types.ObjectId,
    }],
    menu: {
        type: String,
        trim: true,
    },
    opcionMenu: {
        type: String,
        trim: true
    },
    componente: {
        type: String,
        trim: true
    }

})

PantallaSchema.plugin(uniqueValidator);

var Pantalla = mongoose.model('Pantalla',PantallaSchema)
module.exports = {Pantalla}
