// models/Recuperacion.js
const db = require('../database');

class Recuperacion {
    static findAll() {
        return db.query('SELECT * FROM Recuperacion');
    }

    static findById(id) {
        return db.query('SELECT * FROM Recuperacion WHERE idRecuperacion = ?', [id])
            .then(results => results[0]);
    }

    static create(data) {
        return db.query('INSERT INTO Recuperacion SET ?', data)
            .then(result => ({ id: result.insertId, ...data }));
    }

    static update(id, data) {
        return db.query('UPDATE Recuperacion SET ? WHERE idRecuperacion = ?', [data, id])
            .then(() => ({ id, ...data }));
    }

    static delete(id) {
        return db.query('DELETE FROM Recuperacion WHERE idRecuperacion = ?', [id])
            .then(() => ({ id }));
    }

    static findOne(where) {
        return db.query('SELECT * FROM Recuperacion WHERE ?', where)
            .then(results => results[0]);
    }

    static find(where) {
        return db.query('SELECT * FROM Recuperacion WHERE ?', where);
    }
}

module.exports = Recuperacion;
