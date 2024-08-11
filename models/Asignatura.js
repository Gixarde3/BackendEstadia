// models/Asignatura.js
const db = require('../database');

class Asignatura {
    static findAll() {
        return db.query('SELECT * FROM Asignatura');
    }

    static findById(id) {
        return db.query('SELECT * FROM Asignatura WHERE idAsignatura = ?', [id])
            .then(results => results[0]);
    }

    static create(data) {
        return db.query('INSERT INTO Asignatura SET ?', data)
            .then(result => ({ id: result.insertId, ...data }));
    }

    static update(id, data) {
        return db.query('UPDATE Asignatura SET ? WHERE idAsignatura = ?', [data, id])
            .then(() => ({ id, ...data }));
    }

    static delete(id) {
        return db.query('DELETE FROM Asignatura WHERE idAsignatura = ?', [id])
            .then(() => ({ id }));
    }

    static findByCarrera(id) {
        return db.query('SELECT * FROM Asignatura WHERE carrera_id = ?', [id]);
    }

    static findByProfesor(id) {
        return db.query('SELECT * FROM Asignatura WHERE profesor_id = ?', [id]);
    }

    static findByAlumno(id) {
        return db.query('SELECT * FROM Asignatura WHERE id IN (SELECT asignatura_id FROM AlumnoAsignatura WHERE alumno_id = ?)', [id]);
    }
}

module.exports = Asignatura;
