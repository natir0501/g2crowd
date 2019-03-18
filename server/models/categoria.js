var mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')
const {Rol}=require('../models/rol') 
const {Usuario}=require('../models/usuario')

var CategoriaSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    valorCuota: {
        type: Number,
        required: true,
        trim: true
    },
    diaGeneracionCuota: {
        type: Number,
        required: true,
        trim: true
    },
    diaVtoCuota: {
        type: Number,
        required: true,
        trim: true
    },
    requiereEscolaridad:{
        type: Boolean,
        default: false
    },
    cantidadCuotasAnuales: {
        type: Number,
        required: true,
        trim: true
    },
    recargo:{
        type: Number,
        default: 0
    },
    dts:[{
        type: mongoose.Schema.Types.ObjectId, ref: 'Usuario'
    }],
    delegados:[{
        type: mongoose.Schema.Types.ObjectId,  ref: 'Usuario'
    }],
    tesoreros:[{
        type: mongoose.Schema.Types.ObjectId,  ref: 'Usuario'
    }],
    jugadores:[{
        type: mongoose.Schema.Types.ObjectId,  ref: 'Usuario'
    }],
    cuenta:{
        type: mongoose.Schema.Types.ObjectId, ref: 'Cuenta'
    },
    campeonatos:[{
        type: mongoose.Schema.Types.ObjectId, ref: 'Campeonato'
    }],
})

CategoriaSchema.plugin(uniqueValidator);

CategoriaSchema.methods.asignarRoles = async function(){
    console.log('enAsingarRoles')
    var categoria = this
    const roles = await Rol.find()

    let usuario;

    
    for(id of categoria.jugadores){
        console.log(id)
        usuario = await Usuario.findById(id)
        console.log(usuario)
        usuario.roles.push(roles[3]._id)
        usuario.save()
    }
    for(id of categoria.delegados){
        usuario = await Usuario.findById(id)
        usuario.roles.push(roles[0]._id)
        usuario.save()
    }
    for(id of categoria.tesoreros){
        usuario = await Usuario.findById(id)
        usuario.roles.push(roles[2]._id)
        usuario.save()
    }
    for(id of categoria.dts){
        usuario = await Usuario.findById(id)
        usuario.roles.push(roles[1]._id)
        usuario.save()
    } 
    
}


var Categoria = mongoose.model('Categoria',CategoriaSchema)
module.exports = {Categoria}
