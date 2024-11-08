// controllers/GrupoController.js
const models = require('../models');
const functions = require('../helpers/functions');

class GrupoController {
    

    static async getAll(req, res) {
        try {
            const items = await models.Grupo.findAll();
            res.send(items);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async getById(req, res) {
        try {
            const item = await models.Grupo.findById(req.params.id);
            res.send(item);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async create(req, res) {
        try {
            const cantidad = req.body.cantidad;
            const letraInicial = req.body.letra_inicial;
            const items = [];
            const cohorte = await models.Cohorte.findById(req.body.idCohorte);
            if (!cohorte) {
                throw new Error('El cohorte no existe');
            }
            for (let i = 0; i < cantidad; i++) {
                const existente = await models.Grupo.find({ letra: functions.shiftLetter(letraInicial, i), idCohorte: req.body.idCohorte })
                if(existente.lenght > 0){
                    continue;
                }
                items.push(await models.Grupo.create({ letra: functions.shiftLetter(letraInicial, i), idCohorte: req.body.idCohorte }));
            }
            const asignaturasPlan = await models.Asignatura.find({ idPlanEducativo: cohorte.idPlanEducativo });
            if(asignaturasPlan.length < 0) {
                throw new Error('No hay asignaturas en el plan educativo');
            }
            for (let i = 0; i < items.length; i++) {
                for (let j = 0; j < asignaturasPlan.length; j++) {
                    await models.GrupoMateria.create({ idGrupo: items[i].id, idAsignatura: asignaturasPlan[j].idAsignatura });
                }
            }
            res.send(items);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async update(req, res) {
        try {
            const item = await models.Grupo.update(req.params.id, req.body);
            res.send(item);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async delete(req, res) {
        try {
            const idReemplazo = req.params.idReemplazo;
            if(!idReemplazo) {
                throw new Error('El id de reemplazo es requerido');
            }
            if(idReemplazo === req.params.id) {
                throw new Error('El id de reemplazo no puede ser igual al id del grupo a eliminar');
            }
            await models.Alumno.updateGroupIdAlumnos(req.params.id, idReemplazo);
            const item = await models.Grupo.delete(req.params.id);
            res.send(item);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async findOne(req, res) {
        try {
            const item = await models.Grupo.findOne(req.body);
            res.send(item);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async find(req, res) {
        try {
            const items = await models.Grupo.find(req.body);
            res.send(items);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }
}

module.exports = GrupoController;
