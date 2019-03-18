var mongoose = require('mongoose')
const tiposmovimientos= ["Ingreso", "Egreso"];
const estados= ["Pendiente", "Confirmado","Rechazado","Anulado"];

var CuentaSchema = mongoose.Schema({
    movimientos: [{
        fecha: {
            type: Number,
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
            type: mongoose.Schema.Types.ObjectId, ref: 'Concepto',
            require: true
        },
        comentario:{
            type: String,
            trim: true
        },
        confirmado: {
            type: Boolean,
            default: true
        },
        referencia: {
            type: mongoose.Schema.Types.ObjectId,
            default: null
        },
        usuario:{
            type: mongoose.Schema.Types.ObjectId, ref: 'Usuario',
            require: true
        },
        estado: {
            type: String,
            enum: estados
        }
    }],
    saldo: {
        type: Number,
        required: true,
        trim: true,
    }
})

var Cuenta = mongoose.model('Cuenta',CuentaSchema)
module.exports = {Cuenta}