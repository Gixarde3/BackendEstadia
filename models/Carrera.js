// models/Carrera.js
const db = require('../database');

class Carrera {
    static findAll() {
        return db.query('SELECT * FROM Carrera');
    }

    static findById(id) {
        return db.query('SELECT * FROM Carrera WHERE idCarrera = ?', [id])
            .then(results => results[0]);
    }

    static create(data) {
        return db.query('INSERT INTO Carrera SET ?', data)
            .then(result => ({ id: result.insertId, ...data }));
    }

    static update(id, data) {
        return db.query('UPDATE Carrera SET ? WHERE idCarrera = ?', [data, id])
            .then(() => ({ id, ...data }));
    }

    static delete(id) {
        return db.query('DELETE FROM Carrera WHERE idCarrera = ?', [id])
            .then(() => ({ id }));
    }

    static findOne(where) {
        return db.query('SELECT * FROM Carrera WHERE ?', where)
            .then(results => results[0]);
    }

    static find(where) {
        return db.query('SELECT * FROM Carrera WHERE ?', where);
    }
}

module.exports = Carrera;
