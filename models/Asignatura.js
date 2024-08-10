// models/Asignatura.js
const db = require('../database');

class Asignatura {
    static findAll() {
        return db.query('SELECT * FROM Asignatura');
    }

    static findById(id) {
        return db.query('SELECT * FROM Asignatura WHERE id = ?', [id])
            .then(results => results[0]);
    }

    static create(data) {
        return db.query('INSERT INTO Asignatura SET ?', data)
            .then(result => ({ id: result.insertId, ...data }));
    }

    static update(id, data) {
        return db.query('UPDATE Asignatura SET ? WHERE id = ?', [data, id])
            .then(() => ({ id, ...data }));
    }

    static delete(id) {
        return db.query('DELETE FROM Asignatura WHERE id = ?', [id])
            .then(() => ({ id }));
    }
}

module.exports = Asignatura;
