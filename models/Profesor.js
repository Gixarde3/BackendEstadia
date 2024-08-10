// models/Profesor.js
const db = require('../database');

class Profesor {
    static findAll() {
        return db.query('SELECT * FROM Profesor');
    }

    static findById(id) {
        return db.query('SELECT * FROM Profesor WHERE id = ?', [id])
            .then(results => results[0]);
    }

    static create(data) {
        return db.query('INSERT INTO Profesor SET ?', data)
            .then(result => ({ id: result.insertId, ...data }));
    }

    static update(id, data) {
        return db.query('UPDATE Profesor SET ? WHERE id = ?', [data, id])
            .then(() => ({ id, ...data }));
    }

    static delete(id) {
        return db.query('DELETE FROM Profesor WHERE id = ?', [id])
            .then(() => ({ id }));
    }
}

module.exports = Profesor;
