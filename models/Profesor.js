// models/Profesor.js
const db = require('../database');

class Profesor {
    static findAll() {
        return db.query('SELECT * FROM Profesor');
    }

    static findById(id) {
        return db.query('SELECT * FROM Profesor WHERE idProfesor = ?', [id])
            .then(results => results[0]);
    }

    static create(data) {
        return db.query('INSERT INTO Profesor SET ?', data)
            .then(result => ({ id: result.insertId, ...data }));
    }

    static update(id, data) {
        return db.query('UPDATE Profesor SET ? WHERE idProfesor = ?', [data, id])
            .then(() => ({ id, ...data }));
    }

    static delete(id) {
        return db.query('DELETE FROM Profesor WHERE idProfesor = ?', [id])
            .then(() => ({ id }));
    }

    static findOne(where) {
        return db.query('SELECT * FROM Profesor WHERE ?', where)
            .then(results => results[0]);
    }

    static find(where) {
        return db.query('SELECT * FROM Profesor WHERE ?', where);
    }
}

module.exports = Profesor;
