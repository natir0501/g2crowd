var mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')

var TipoEventoSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    datosDeportivos: {
        type: Boolean,
        default: false,
        
    }
})

TipoEventoSchema.plugin(uniqueValidator);

var TipoEvento = mongoose.model('TipoEvento',TipoEventoSchema)
module.exports = {TipoEvento}
