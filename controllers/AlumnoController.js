// controllers/AlumnoController.js
const models = require('../models');
const ExcelJS = require('exceljs');
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
                await this.create(req, res);
            }

            // Crear una nueva instancia de ExcelJS Workbook
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.readFile(file.path);

            // Suponiendo que trabajas con la primera hoja
            const worksheet = workbook.getWorksheet(1);
            const data = [];

            worksheet.eachRow((row, rowNumber) => {
                data.push(row.values); // Guarda cada fila en el array `data`
            });

            const firstRow = data.shift(); // Elimina la primera fila (cabecera)

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
            for (const item of items) {
                const usuario = await models.Usuario.create({nombre: item["Nombre Alumno"], apellido_paterno: item["Paterno Alumno"], apellido_materno: item["Materno Alumno"], email_personal: item["Matrícula"] + "@upemor.edu.mx", clave_identificacion: item["Matrícula"], password: "PASSWORDNOACCESIBLE", privilege: 1});
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
            res.send(alumnos);
        }
        catch (error) {
            res.status(500).send({ error: error.message });
        }
    }
}

module.exports = AlumnoController;
