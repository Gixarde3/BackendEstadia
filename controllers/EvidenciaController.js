// controllers/EvidenciaController.js
const models = require('../models');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
class EvidenciaController {
    static async getAll(req, res) {
        try {
            const items = await models.Evidencia.findAll();
            res.send(items);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async getById(req, res) {
        try {
            const item = await models.Evidencia.findById(req.params.id);
            res.send(item);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async create(req, res) {
        try {
            const archivoDescripcion = req.files.archivoDescripcion;
            if(archivoDescripcion){
                const archivoBuffer = fs.readFileSync(archivoDescripcion.path);
                // Nuevo nombre archivo encriptado con md5
                const nombre = crypto.randomBytes(16).toString('hex') + path.extname(archivoDescripcion.name);
                req.body.archivoDescripcion = nombre;
                fs.writeFileSync(path.join(__dirname, `../uploads/${nombre}`), archivoBuffer);
            }else{
                req.body.archivoDescripcion = null;
            }
            const item = await models.Evidencia.create(req.body);
            res.send(item);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async update(req, res) {
        try {
            const item = await models.Evidencia.update(req.params.id, req.body);
            res.send(item);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async delete(req, res) {
        try {
            const item = await models.Evidencia.delete(req.params.id);
            res.send(item);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async findOne(req, res) {
        try {
            const item = await models.Evidencia.findOne(req.body);
            res.send(item);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async find(req, res) {
        try {
            const items = await models.Evidencia.find(req.body);
            res.send(items);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }
}

module.exports = EvidenciaController;
