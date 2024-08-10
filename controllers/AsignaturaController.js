// controllers/AsignaturaController.js
const models = require('../models');

class AsignaturaController {
    static async getAll(req, res) {
        try {
            const items = await models.Asignatura.findAll();
            res.send(items);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async getById(req, res) {
        try {
            const item = await models.Asignatura.findById(req.params.id);
            res.send(item);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async create(req, res) {
        try {
            const item = await models.Asignatura.create(req.body);
            res.send(item);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async update(req, res) {
        try {
            const item = await models.Asignatura.update(req.params.id, req.body);
            res.send(item);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async delete(req, res) {
        try {
            const item = await models.Asignatura.delete(req.params.id);
            res.send(item);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }
}

module.exports = AsignaturaController;
