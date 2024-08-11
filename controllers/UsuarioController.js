// controllers/UsuarioController.js
const models = require('../models');
const bcrypt = require('bcrypt');
const controllers = require('./index');
const path = require('path');

class UsuarioController {
    static async getAll(req, res) {
        try {
            const items = await models.Usuario.findAll();
            res.send(items);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async getById(req, res) {
        try {
            const item = await models.Usuario.findById(req.params.id);
            res.send(item);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async create(req, res) {
        try {
            console.log(req.body);
            const password = bcrypt.hashSync(req.body.password, 10);
            req.body.password = password;
            const item = await models.Usuario.create(req.body);
            res.send(item);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async update(req, res) {
        try {
            const item = await models.Usuario.update(req.params.id, req.body);
            res.send(item);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async delete(req, res) {
        try {
            const item = await models.Usuario.delete(req.params.id);
            res.send(item);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async login(req, res) {
        try {
            const { clave_identificacion, password } = req.body;
            const user = await models.Usuario.findOne({clave_identificacion});
            if (!user) {
                return res.status(404).send({ error: 'User not found' });
            }
            const isPasswordValid = bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).send({ error: 'Invalid password' });
            }
            req.session.user = user;
            res.send(user);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async getByFilter(req, res) {
        try {
            const { filter, value } = req.params;
            const items = await models.Usuario.findByFiltro({ [filter]: value });
            res.send(items);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async solicitarCambioContrasena(req, res) {
        try {

            const identificador = req.body.identificador;
            const user = await models.Usuario.findByIdentificador(identificador);
            if (!user) {
                return res.status(404).send({ error: 'User not found' });
            }
            const email = user.email_personal;
            const token = Math.random().toString(36).substring(2, 30) + Math.random().toString(36).substring(2, 30 ) + Math.random().toString(36).substring(2, 30) + Math.random().toString(36).substring(2, 30);
            await models.Usuario.generateToken(identificador, token);
            console.log(path.join(__dirname, '../img/logo.webp'));
            // Enviar correo
            try{
            const mailSent = await controllers.MailController.sendMail(email, "Solicitud de recuperación de contraseña", `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Usuario registrado con éxito</title>
                    <link rel="preconnect" href="https://fonts.googleapis.com">
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600&display=swap" rel="stylesheet">
                    <style>
                        :root{
                            --principal: #592c80;
                        }
                        *{
                            font-family: 'Open Sans', sans-serif;
                            box-sizing: border-box;
                        }
                        main{
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            padding: 1rem;
                        }
                        h1{
                            margin: 0;
                            font-size: 32px;
                            text-align: center;
                        }
                        p{
                            margin:0;
                            font-family: "Open Sans";
                            font-size: 16px;
                            line-height: 1.57143;
                            text-align: center;
                            width: 100%;
                        }
                        a{
                            text-decoration: none;
                            color: white;
                        }
                        .accept{
                            background-color: #592c80;
                            color: #fff !important;
                            font-size: 1rem;
                            font-weight: bold;
                            padding: 10px 20px;
                            letter-spacing: 2px;
                            cursor: pointer;
                            transition: all 0.3s;
                        }
                        .accept:hover{
                            scale: 1.01;
                        }
                        .accept:active{
                            scale: 0.99;
                        }
                        .aclaracion{
                            font-size: 12px;
                            color: #8c8c8c;
                        }
                        img{
                            max-width: 100%;
                            width: 200px;
                        }
                    </style>
                </head>
                <body>
                    <main>
                        <!-- TODO Mail respuesta enviada -->
                        <div style="text-align: center; padding: 20px;">
                            <img src="cid:logoUpemor" alt="Logo de la UPEMOR" style="max-width: 100%;">
                        </div>
                        <h1 style="text-align: center; color: #F50003;">Has solicitado un cambio de contraseña</h1>
                        <div style="text-align: center; padding: 20px; width: 100%">
                            <a href="http://localhost:5173/cambiar-contrasena/${token}" class="accept">Cambiar contraseña</a>
                        </div>
                        <p class="aclaracion">Si no funciona, copia y pega el siguiente enlace en tu navegador: <a href="http://localhost:5173/cambiar-contrasena/${token}">http://localhost:5173/cambiar-contrasena/${token}</a></p>
                    </main> 
                </body>
                </html>
            `,
            [
                {
                filename: 'logo.jpg',
                path: path.join(__dirname, '../img/logo.jpg'),
                cid: 'logoUpemor' // ID del archivo
                }
            ]
        );
            res.status(200).send({message: 'Se ha enviado un correo a la dirección proporcionada'});
            }catch(error){
                return Promise.reject(error);
            }
        }catch(error){
            res.status(500).send({error: error.message});
        }
    }

    static async cambiarContrasena(req, res){
        try{
            const {token, password} = req.body;
            const recuperacion = await models.Recuperacion.findOne({token});
            if(!recuperacion){
                return res.status(404).send({error: 'Token no encontrado'});
            }
            if(recuperacion.fecha_expiracion < new Date()){
                return res.status(401).send({error: 'Token expirado'});
            }
            const user = await models.Usuario.findById(recuperacion.idUsuario);
            const newPassword = bcrypt.hashSync(password, 10);
            await models.Usuario.update(user.idUsuario, {password: newPassword});
            await models.Recuperacion.delete(recuperacion.idRecuperacion);
            res.status(200).send({message: 'Contraseña actualizada con éxito'});
        }catch(error){
            res.status(500).send({error: error.message});
        }
    }
}

module.exports = UsuarioController;
