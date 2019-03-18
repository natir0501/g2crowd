var express = require('express');
var api = express.Router();
const { Categoria } = require('../models/categoria')
const { Usuario } = require('../models/usuario')
const { Cuenta } = require('../models/cuenta')

const _ = require('lodash')
const { ApiResponse } = require('../models/api-response')
var { enviarNotificacion, enviarCorreoNotificacion } = require('../Utilidades/utilidades')

var infoUsuario = 'nombre apellido email perfiles ci celular direccion fechaVtoCarneSalud delegadoInstitucional fechaNacimiento'
infoUsuario += ' fechaUltimoExamen requiereExamen emergencia notificacionEmail sociedad contacto posiciones activo perfiles categoriacuota ultimoMesCobrado cuenta  cuotaEspecial valorCuota'


api.post('/pagos', async (req, res) => {
    try {

        let jugador = await Usuario.findById(req.body.jugadorid)
            .populate('cuenta')
            .populate('movimientos')
            .exec();
        let conf = false;

        let categoria = await Categoria.findById(jugador.categoriacuota)
            .populate('cuenta')
            .populate('movimientos')
            .populate('tesoreros')
            .exec();


        let mov = {
            fecha: new Date(),
            monto: req.body.monto,
            tipo: "Ingreso",
            concepto: req.body.concepto,
            comentario: req.body.comentario,
            confirmado: conf,
            usuario: req.usuarioRequest,
            referencia: null,
            estado: "Pendiente"
        };

        /*Si el que ingresa el movimiento y el usuario al que registro el pago son distintos
        asumo que el registro de pago lo hace el tesorero, entonces confirmado=true y cambio saldo 
        de la categoría
         */
        let cuentacategoria = await Cuenta.findById(categoria.cuenta._id).populate('movimientos')
        if (jugador._id.toString() !== req.usuarioRequest._id.toString()) {
            mov.confirmado = true;
            conf = true
            cuentacategoria.saldo = parseInt(cuentacategoria.saldo) + parseInt(mov.monto)
            mov.estado = "Confirmado"
        }

        let cuentajugador = await Cuenta.findById(jugador.cuenta._id).populate('movimientos')
        cuentajugador.movimientos.push({...mov, comentario: mov.comentario + ` Pago en ${categoria.nombre}`});
        await cuentajugador.save()

        /*Si el movimiento no está confirmado, guardo la referencia al mov del jugador en el movimiento 
        que voy a guardar en la categoría.  
        */
        if (conf === false) {

            mov.referencia = cuentajugador.movimientos[cuentajugador.movimientos.length - 1]._id;
            for (let t of categoria.tesoreros) {
                tituloNot = `Aviso de Pago`
                bodyNot = `Hola ${t.nombre}! ${jugador.nombre} ${jugador.apellido} ha realizado una solicitud de pago. Ingresá a la App para confirmarlo`

                if (t.hasMobileToken()) {

                    enviarNotificacion(t, tituloNot, bodyNot)
                } else {
                    enviarCorreoNotificacion(t, tituloNot, bodyNot)
                    if (t.tokens.length > 1) {
                        enviarNotificacion(t, tituloNot, bodyNot)
                    }
                }
            }
        } else {
            cuentajugador.saldo = parseInt(cuentajugador.saldo) + parseInt(mov.monto)
            await cuentajugador.save()
        }
        let movimientoCategoria = {...mov}
        movimientoCategoria.comentario = movimientoCategoria.comentario + ` ${jugador.nombre} ${jugador.apellido}`
        cuentacategoria.movimientos.push(movimientoCategoria);


        await cuentacategoria.save()

        res.status(200).send(new ApiResponse({ mov }))

    } catch (e) {
        console.log(e)
        res.status(400).send(new ApiResponse({}, `Mensaje: ${e}`))
    }
})


api.patch('/pagos/confirmacion/:id', async (req, res) => {

    try {

        let categoria = await Categoria.findById(req.params.id)
            .populate('cuenta')
            .populate('movimientos')
            .exec();

        let jugador = await Usuario.findById(req.body.jugadorid)
            .populate('cuenta')
            .populate('movimientos')
            .exec();

        let nuevoSaldoCat = categoria.cuenta.saldo + req.body.monto
        let nuevoSaldoJugador = jugador.cuenta.saldo + req.body.monto
        let movsActualizadosCat = categoria.cuenta.movimientos
        let encontre = false
        for (movim of movsActualizadosCat) {
            if (movim.referencia !== null) {

                if (movim.referencia.toString() === req.body.referencia) {
                    encontre = true;
                    if (movim.monto === req.body.monto) {
                        movim.confirmado = true;
                        movim.referencia = null;
                        movim.comentario = movim.comentario + " " + " | Comentario al confirmar: " + req.body.comentario
                        movim.estado = "Confirmado"
                    } else {
                        res.status(404).send(new ApiResponse({},
                            "El monto del movimiento a confirmar en la cuenta de la categoria no coincide con el monto del movimiento pendiente."))
                    }

                }
            }
        }
        if (!encontre) {
            return res.status(404).send(new ApiResponse({}, 'No se encontró movimiento'))
        }
        let movsActualizadosJug = jugador.cuenta.movimientos
        for (mov of movsActualizadosJug) {
            if (mov._id.toString() === req.body.referencia) {
                if (mov.monto === req.body.monto) {
                    mov.confirmado = true
                    mov.comentario = mov.comentario + " " + " | Comentario al confirmar: " + req.body.comentario + ` Pago en ${categoria.nombre}`
                    mov.estado = "Confirmado"
                } else {
                    res.status(404).send(new ApiResponse({},
                        "El monto del movimiento a confirmar en la cuenta del jugador no coincide con el monto del movimiento pendiente."))
                }

            }
        }
        await Cuenta.findOneAndUpdate({
            _id: categoria.cuenta._id
        }, {
                $set: { saldo: nuevoSaldoCat, movimientos: movsActualizadosCat }
            }, {
                new: true
            })
        await Cuenta.findOneAndUpdate({
            _id: jugador.cuenta._id
        }, {
                $set: { saldo: nuevoSaldoJugador, movimientos: movsActualizadosJug }
            }, {
                new: true
            })
        tituloNot = `Confirmación de Pago`,
            bodyNot = `Hola ${jugador.nombre}! Tu solicitud de pago fue confirmada `


        if (jugador.hasMobileToken()) {

            enviarNotificacion(jugador, tituloNot, bodyNot)
        } else {
            enviarCorreoNotificacion(jugador, tituloNot, bodyNot)
            if (jugador.tokens.length > 1) {
                enviarNotificacion(jugador, tituloNot, bodyNot)
            }
        }

        res.status(200).send(new ApiResponse({ confirmado: true }, 'Pago confirmado correctamente.'))

    } catch (e) {
        res.status(400).send(new ApiResponse({}, `Mensaje: ${e}`))
    }
})


api.patch('/pagos/rechazo/:id', async (req, res) => {

    try {

        let jugador = await Usuario.findById(req.body.jugadorid)
            .populate('cuenta')
            .exec();

        let cuentaJugador = await Cuenta.findById(jugador.cuenta._id)
            .populate('movimientos')
            .exec()

        let cuentaCat = await Cuenta.findById(req.params.id)
            .populate('movimientos')
            .exec()

        let movJugadorEncontrado;
        let movCategoriaEncontrado;
        let encontre = false
        //En la cuenta del usuario dejo el mov en estado rechazado (valido por id y por monto)
        for (let movimiento of cuentaJugador.movimientos) {
            if (movimiento._id.toString() === req.body.referencia &&
                movimiento.monto === req.body.monto && movimiento.estado === 'Pendiente') {
                encontre=true;
                movJugadorEncontrado = true
                movimiento.estado = "Rechazado"
                movimiento.comentario = movimiento.comentario + "| Comentario al rechazar: " + req.body.comentario
            }
        }
        if(!encontre){
            return res.status(404).send(new ApiResponse({},'No se encontró el movimiento'))
        }
        await cuentaJugador.save()

        //En la cuenta de la categoría, borro el movimiento
        for (let i = 0; i < cuentaCat.movimientos.length; i++) {
            if (cuentaCat.movimientos[i].referencia !== null) {
                movCategoriaEncontrado = true
                if (cuentaCat.movimientos[i].referencia.toString() === req.body.referencia
                    && cuentaCat.movimientos[i].monto === req.body.monto) {
                    cuentaCat.movimientos.splice(i, 1)
                    await cuentaCat.save()
                }
            }

        }
        if (movJugadorEncontrado && movCategoriaEncontrado) {
            let movimiento = movCategoriaEncontrado
            tituloNot = `Rechazo de Pago`
            bodyNot = `Hola ${jugador.nombre}! Tu solicitud de pago fue rechazada. Consultá con el tesorero o delegado de tu categoría `

            if (jugador.hasMobileToken() > 1) {

                enviarNotificacion(jugador, tituloNot, bodyNot)
            } else {
                enviarCorreoNotificacion(jugador, tituloNot, bodyNot)
                if (jugador.tokens.length > 1) {
                    enviarNotificacion(jugador, tituloNot, bodyNot)
                }
            }

            res.status(200).send(new ApiResponse({ movimiento }, 'Ok'))
        } else {
            res.status(404).send(new ApiResponse({}, 'Ocurrió un error al rechazar el movimiento.'))
        }


    } catch (e) {
        console.log(e);
    }
})

module.exports = api;