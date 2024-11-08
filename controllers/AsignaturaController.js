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

    static async getAsignaturasByCarrera(req, res) {
        try {
            const items = await models.Asignatura.findByCarrera(req.params.id);
            res.send(items);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async getAsignaturasByProfesor(req, res) {
        try {
            const items = await models.Asignatura.findByProfesor(req.params.id);
            res.send(items);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async getAsignaturasByAlumno(req, res) {
        try {
            const items = await models.Asignatura.findByAlumno(req.params.id);
            res.send(items);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async findOne(req, res) {
        try {
            const item = await models.Asignatura.findOne(req.body);
            res.send(item);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async find(req, res) {
        try {
            const items = await models.Asignatura.find(req.body);
            res.send(items);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async getByUsuario(req, res) {
        try {
            const usuario = await models.Usuario.findById(req.params.idUsuario);
            if (!usuario) {
                throw new Error('El usuario no existe');
            }
            let items = [];
            if (usuario.privilege === 2) {
                items = await models.Asignatura.findByProfesor(usuario.idUsuario);
            } else if (usuario.privilege === 1) {
                items = await models.Asignatura.findByAlumno(usuario.idUsuario);
            } else if (usuario.privilege === 3) {
                items = await models.Asignatura.findByCarrera(usuario.idUsuario);
            }
            res.send(items);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }
}

module.exports = AsignaturaController;
