// controllers/AlumnoController.js
const models = require('../models');
const ExcelJS = require('exceljs');
const controllers = require('../controllers');
const path = require('path');
const fs = require('fs');

class AlumnoController {
    static async getAll(req, res) {
        try {
            const items = await models.Alumno.findAll();
            res.send(items);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async getById(req, res) {
        try {
            const item = await models.Alumno.findById(req.params.id);
            res.send(item);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async create(req, res) {
        try {
            const item = await models.Alumno.create(req.body);
            res.send(item);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async update(req, res) {
        try {
            const item = await models.Alumno.update(req.params.id, req.body);
            res.send(item);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async delete(req, res) {
        try {
            const item = await models.Alumno.delete(req.params.id);
            res.send(item);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async findOne(req, res) {
        try {
            const item = await models.Alumno.findOne(req.body);
            res.send(item);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async find(req, res) {
        try {
            const items = await models.Alumno.find(req.body);
            res.send(items);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async createMany(req, res) {
        try{
            const file = req.files.CrearPorLote;
            if (!file) {
                req.body = {
                    idCohorte: req.body.idCohorte,
                    idUsuario: req.body.idUsuario,
                    idGrupo: req.body.idGrupo,
                    idCarrera: req.body.idCarrera
                }
                await AlumnoController.create(req, res);
            }

            // Crear una nueva instancia de ExcelJS Workbook
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.readFile(file.path);

            // Suponiendo que trabajas con la primera hoja
            const worksheet = workbook.getWorksheet(1);
            const data = [];

            worksheet.eachRow((row, rowNumber) => {
                data.push(row.values);
            });

            const firstRow = data.shift();

            // Convierte los datos a un objeto donde las claves son la primera fila
            const items = data.map(row => {
                const item = {};
                firstRow.forEach((key, index) => {
                    item[key] = row[index];
                });
                return item;
            });

            // Eliminar el archivo subido
            fs.unlinkSync(file.path);
            
            // Crear los usuarios en la base de datos con los datos del archivo
            const alumnos = [];
            const tos = [];
            const mails = [];
            for (const item of items) {
                if(item["Nombre Alumno"] == null){
                    continue;
                }
                let usuario = await models.Usuario.findOne({clave_identificacion: item["Matrícula"]});
                
                if(usuario == null){
                    usuario = await models.Usuario.create({nombre: item["Nombre Alumno"], apellido_paterno: item["Paterno Alumno"], apellido_materno: item["Materno Alumno"], email_personal: item["Matrícula"] + "@upemor.edu.mx", clave_identificacion: item["Matrícula"], password: "PASSWORDNOACCESIBLE", privilege: 1});
                    const token = Math.random().toString(36).substring(2, 30) + Math.random().toString(36).substring(2, 30 ) + Math.random().toString(36).substring(2, 30) + Math.random().toString(36).substring(2, 30);
                    await models.Usuario.generateToken(item["Matrícula"], token);
                    tos.push(item["Matrícula"] + "@upemor.edu.mx"); 
                    mails.push(`
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
                                        <img src="cid:logoUpemor" alt="Logo de la UPEMOR" style="max-width: 60%;">
                                    </div>
                                    <h1 style="text-align: center; color: #F50003;">Un administrador te ha registrado al sistema, por favor, genera una contraseña</h1>
                                    <div style="text-align: center; padding: 20px; width: 100%">
                                        <a href="http://localhost:5173/cambiar-contrasena/${token}" class="accept">Generar contraseña</a>
                                    </div>
                                    <p class="aclaracion">Si no funciona, copia y pega el siguiente enlace en tu navegador: <a href="http://localhost:5173/cambiar-contrasena/${token}">http://localhost:5173/cambiar-contrasena/${token}</a></p>
                                </main> 
                            </body>
                            </html>
                        `
                    );
                }
                if(usuario == null){
                    throw new Error("No se pudo crear el usuario: " + item["Matrícula"]);
                }
                const grupo = await models.Grupo.findOne({letra: item["Letra"], idCohorte: req.body.idCohorte});
                if(grupo == null){
                    throw new Error("No existe ningún grupo con la letra " + item["Letra"] + " en esta cohorte");
                }
                const planEducativo = await models.PlanEducativo.findOne({clave: item["Plan Estudios"]});
                if(planEducativo == null){
                    throw new Error("No existe ningún plan educativo con la clave " + item["Plan Estudios"]);
                }
                const alumno = await models.Alumno.create({idUsuario: usuario.idUsuario, idGrupo: grupo.idGrupo, idCarrera: planEducativo.idCarrera, idCohorte: req.body.idCohorte});
                alumnos.push(alumno);
            }
            controllers.MailController.sendMails(tos, "¡Felicidades! Un administrador te registró", mails, [
                {
                    filename: 'logo.jpg',
                    path: path.join(__dirname, '../img/logo.jpg'),
                    cid: 'logoUpemor' // ID del archivo
                }
            ]);
            res.send(alumnos);
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ error: error.message });
        }
    }
}

module.exports = AlumnoController;
