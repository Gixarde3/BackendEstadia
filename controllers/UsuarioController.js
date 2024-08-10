// controllers/UsuarioController.js
const models = require('../models');
const brcrypt = require('bcrypt');

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
            const password = brcrypt(req.body.password);
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
            const { email, password } = req.body;
            const user = await models.Usuario.findOne({ where: { email } });
            if (!user) {
                return res.status(404).send({ error: 'User not found' });
            }
            const isPasswordValid = brcrypt.compare(password, user.password);
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
