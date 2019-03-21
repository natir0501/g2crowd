const { Categoria } = require('../models/categoria')
const { Usuario } = require('../models/usuario')
const { Rol } = require('../models/rol')
const { ObjectID } = require('mongodb')
const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const axios = require('axios')
const _ = require('lodash')

const validarTipo = async (arrayUsuarios, tipoUsuario) => {
    let usuariosInvalidos = []
    const idTipoUsuario = await Rol.find({ codigo: tipoUsuario })
    let usuarios = await Usuario.find({ _id: { $in: arrayUsuarios } })
    for (usuario of usuarios) {
        if (!usuario.roles.includes(idTipoUsuario)) {
            usuariosInvalidos.push(usuario._id)
        }
    }
    return usuariosInvalidos


}


const validarId = async (arrayId) => {
    for (id of arrayId) {
        if (!ObjectID.isValid) {
            return false
        }
    }
    return true
}

const enviarReporteBatch = async(reporte)=>{
   
    let categorias = await Categoria.find({}).populate('tesoreros')
    
    let correos = []
    for (cat of categorias){
        correos = [...correos, ...cat.tesoreros.map((tes)=>{return tes.email})]
    }
    correos = _.uniq(correos)
    console.log(correos)
    
    const oauth2Client = new OAuth2(
        '618306918004-5asel1f42qbe5j26thq0p63ipebfifqg.apps.googleusercontent.com',
        'atgGsj6rBrKimCSB7Aqfu8aE', // Client Secret
        'https://developers.google.com/oauthplayground' // Redirect URL
    );

    oauth2Client.setCredentials({
        refresh_token: '1/R_0xTbenBWlkDLo6YZUDFgZohCwbbxP8H-Ol0WGQTq__G0mkHpiJ6fqZpF1eKA5b'
    });
    const tokens = await oauth2Client.refreshAccessToken()
    const accessToken = tokens.credentials.access_token


    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: "OAuth2",
            user: "tuequipo.uy@gmail.com",
            clientId: "618306918004-5asel1f42qbe5j26thq0p63ipebfifqg.apps.googleusercontent.com",
            clientSecret: "atgGsj6rBrKimCSB7Aqfu8aE",
            refreshToken: "1/R_0xTbenBWlkDLo6YZUDFgZohCwbbxP8H-Ol0WGQTq__G0mkHpiJ6fqZpF1eKA5b",
            accessToken: accessToken
        }
    });

    cuerpo = '<h3>Detalle de proceso de cobro de cuotas</h3><br>'
    for(let linea of reporte){
        cuerpo += `${linea}<br>`
    }
    console.log(cuerpo)
                
    var mailOptions = {
        from: 'tuEquipo App <tuequipo.uy@gmail.com>',
        to: correos,
        subject: 'Reporte cobro cuotas',
        html: cuerpo
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
    });
}

const enviarCorreoAlta = async (usuario) => {

    const oauth2Client = new OAuth2(
        '618306918004-5asel1f42qbe5j26thq0p63ipebfifqg.apps.googleusercontent.com',
        'atgGsj6rBrKimCSB7Aqfu8aE', // Client Secret
        'https://developers.google.com/oauthplayground' // Redirect URL
    );

    oauth2Client.setCredentials({
        refresh_token: '1/R_0xTbenBWlkDLo6YZUDFgZohCwbbxP8H-Ol0WGQTq__G0mkHpiJ6fqZpF1eKA5b'
    });
    const tokens = await oauth2Client.refreshAccessToken()
    const accessToken = tokens.credentials.access_token


    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: "OAuth2",
            user: "tuequipo.uy@gmail.com",
            clientId: "618306918004-5asel1f42qbe5j26thq0p63ipebfifqg.apps.googleusercontent.com",
            clientSecret: "atgGsj6rBrKimCSB7Aqfu8aE",
            refreshToken: "1/R_0xTbenBWlkDLo6YZUDFgZohCwbbxP8H-Ol0WGQTq__G0mkHpiJ6fqZpF1eKA5b",
            accessToken: accessToken
        }
    });

    let ambiente;
    if (process.env.AMBIENTE === 'PROD') {
        ambiente = ''
    }
    else {
        ambiente = `[${process.env.AMBIENTE}] - `
    }
    let url = process.env.URLAPP + `/#/registro/${usuario.tokens[0].token}`
    let html = `<h2>Hola! Bienvenido/a a tuEquipo app.</h2>
                <p>Si estás desde una PC, por favor ingresá a este <a href="${url}">Link</a> para completar registro:</p><br>
                

                <h4>De lo contrario, sigue estos pasos para instalación en Android o iOS</h4>
                <p>
                
                
                Ingresá al link de más arriba a través del navegador Google Chrome, si tu SO es Android o Safari para iOS.<br><br>
                Si es Android, aceptá el pedido para recibir notificaciones por parte de la app.<br><br>
                Para instalar la app en el escritorio, podés seleccionar "agregar al home" desde las opciones del sitio
                o aceptar esta acción si la app te lo pide en el primer ingreso” <br><br>
                Luego, completá el registro inicial y cerrá el navegador.<br><br>
                Estás listo para ingresar a la app desde el ícono instalado antes y realizar el log in!<br><br>

                <b>También podés visitar nuestra app mobile desde cualquier pc sin perder ninguna prestación.</b>

                </p>
                `
                
    var mailOptions = {
        from: 'tuEquipo App <tuequipo.uy@gmail.com>',
        to: usuario.email,
        subject: `${ambiente}Confirmación de registro y alta en CEIapp`,
        html
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
    });
}

const enviarCorreoNotificacion = async (usuario, asunto, cuerpo)=>{
    if(!usuario.notificacionesEmail){
        return
    }
    
    const oauth2Client = new OAuth2(
        '618306918004-5asel1f42qbe5j26thq0p63ipebfifqg.apps.googleusercontent.com',
        'atgGsj6rBrKimCSB7Aqfu8aE', // Client Secret
        'https://developers.google.com/oauthplayground' // Redirect URL
    );

    oauth2Client.setCredentials({
        refresh_token: '1/R_0xTbenBWlkDLo6YZUDFgZohCwbbxP8H-Ol0WGQTq__G0mkHpiJ6fqZpF1eKA5b'
    });
    const tokens = await oauth2Client.refreshAccessToken()
    const accessToken = tokens.credentials.access_token


    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: "OAuth2",
            user: "tuequipo.uy@gmail.com",
            clientId: "618306918004-5asel1f42qbe5j26thq0p63ipebfifqg.apps.googleusercontent.com",
            clientSecret: "atgGsj6rBrKimCSB7Aqfu8aE",
            refreshToken: "1/R_0xTbenBWlkDLo6YZUDFgZohCwbbxP8H-Ol0WGQTq__G0mkHpiJ6fqZpF1eKA5b",
            accessToken: accessToken
        }
    });

                
    var mailOptions = {
        from: 'tuEquipo App <tuequipo.uy@gmail.com>',
        to: usuario.email,
        subject: asunto,
        html: cuerpo
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
    });
}

const enviarNotificacion = async (usuario, title, body) => {
    var headers = {
        'Content-Type': 'application/json',
        'Authorization': process.env.PUSHTOKEN
    }
   
    for (let i = 1; i < usuario.tokens.length; i++) {
        
        let mensaje = {

            "to": usuario.tokens[i].token,
            "data": {
                "notification": {
                    "title": title,
                    "body": body
                }

            }

        }
        axios.post('https://fcm.googleapis.com/fcm/send', mensaje, { headers })
            .then((res) => {
                
            })
            .catch((error) => {
                console.log('Error al enviar notification ',mensaje)
            })

    }


}


module.exports = { validarTipo, validarId, enviarCorreoAlta, enviarNotificacion,enviarReporteBatch, enviarCorreoNotificacion };