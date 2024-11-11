// controllers/GrupoMateriaController.js
const models = require('../models');

class GrupoMateriaController {
    static async getAll(req, res) {
        try {
            const items = await models.GrupoMateria.findAll();
            res.send(items);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async getById(req, res) {
        try {
            const item = await models.GrupoMateria.findById(req.params.id);
            res.send(item);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async create(req, res) {
        try {
            const item = await models.GrupoMateria.create(req.body);
            res.send(item);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async update(req, res) {
        try {
            const item = await models.GrupoMateria.update(req.params.id, req.body);
            res.send(item);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async delete(req, res) {
        try {
            const item = await models.GrupoMateria.delete(req.params.id);
            res.send(item);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async findOne(req, res) {
        try {
            const item = await models.GrupoMateria.findOne(req.body);
            res.send(item);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async find(req, res) {
        try {
            const items = await models.GrupoMateria.find(req.body);
            res.send(items);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async getProximasEntregas(req, res) {
        try{
            const items = await models.Evidencia.findCercaDeEntregar(req.params.id);
            res.send(items);
        }catch(error){
            res.status(500).send({ error: error.message });
        }
    }

    static async getCalificaciones(req, res) {
        try{
            const idGrupoMateria = req.params.id;
            const idAlumno = req.params.idAlumno;
            const items = await models.GrupoMateria.getCalificaciones(idGrupoMateria, idAlumno);
            res.send(items);
        }catch(error){
            res.status(500).send({ error: error.message });
        }
    }
}

module.exports = GrupoMateriaController;
