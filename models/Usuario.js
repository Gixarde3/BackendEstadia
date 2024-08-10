// models/Usuario.js
const db = require('../database');

class Usuario {
    static findAll() {
        return db.query('SELECT * FROM Usuario');
    }

    static findById(id) {
        return db.query('SELECT * FROM Usuario WHERE id = ?', [id])
            .then(results => results[0]);
    }

    static create(data) {
        return db.query('INSERT INTO Usuario SET ?', data)
            .then(result => ({ id: result.insertId, ...data }));
    }

    static update(id, data) {
        return db.query('UPDATE Usuario SET ? WHERE id = ?', [data, id])
            .then(() => ({ id, ...data }));
    }

    static delete(id) {
        return db.query('DELETE FROM Usuario WHERE id = ?', [id])
            .then(() => ({ id }));
    }
}

module.exports = Usuario;
