var mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')
const tiposmovimientos= ["Ingreso", "Egreso"];

var ConceptosCajaSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    tipo: {
        type: String,
        enum: tiposmovimientos
    }
})

ConceptosCajaSchema.plugin(uniqueValidator);

var ConceptosCaja = mongoose.model('ConceptosCaja',ConceptosCajaSchema)
module.exports = {ConceptosCaja}
    