var mongoose = require('mongoose')
const tiposmovimientos= ["Ingreso", "Egreso"];
const estados= ["Pendiente", "Confirmado","Rechazado"];

var MovimientoSchema = mongoose.Schema({
    fecha: {
        type: String,
        required: true,
        trim: true
    },
    monto: {
        type: Number,
        required: true,
        trim: true,
    },
    tipo: {
        type: String,
        enum: tiposmovimientos,
        require: true
    },
    concepto:{
        type: mongoose.Schema.Types.ObjectId, ref: 'ConceptosCaja',
        require: true
    },
    comentario:{
        type: String,
        trim: true
    },
    usuario:{
        type: mongoose.Schema.Types.ObjectId, ref: 'Usuario',
        require: false
    },


})

var Movimiento = mongoose.model('Movimiento',MovimientoSchema)
module.exports = {Movimiento}
