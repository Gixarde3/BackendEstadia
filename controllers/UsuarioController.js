// controllers/UsuarioController.js
const models = require('../models');
const bcrypt = require('bcrypt');

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
}

module.exports = UsuarioController;
