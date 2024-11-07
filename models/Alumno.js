// models/Alumno.js
const db = require('../database');

class Alumno {
    static findAll() {
        return db.query('SELECT * FROM Alumno');
    }

    static findById(id) {
        return db.query('SELECT * FROM Alumno WHERE idAlumno = ?', [id])
            .then(results => results[0]);
    }

    static async create(data) {
        const alumnos = await db.query('SELECT * FROM Alumno WHERE idUsuario = ?', [data.idUsuario]);
        if (alumnos.length > 0) {
            return alumnos[0];
        }
        return db.query('INSERT INTO Alumno SET ?', data)
            .then(result => ({ id: result.insertId, ...data }));
    }

    static update(id, data) {
        return db.query('UPDATE Alumno SET ? WHERE idAlumno = ?', [data, id])
            .then(() => ({ id, ...data }));
    }

    static delete(id) {
        return db.query('DELETE FROM Alumno WHERE idAlumno = ?', [id])
            .then(() => ({ id }));
    }

    static findOne(where) {
        return db.query('SELECT * FROM Alumno WHERE ?', where)
            .then(results => results[0]);
    }

    static find(where) {
        // Asumimos que 'where' es un objeto con clave-valor
        const keys = Object.keys(where);
        const values = keys.map(key => `Usuario.${key} LIKE ?`);
        
        // Crear la consulta SQL con LIKE
        const sql = `SELECT Alumno.*, Usuario.* FROM Alumno INNER JOIN Usuario ON Usuario.idUsuario = Alumno.idUsuario WHERE ${values.join(' AND ')}`;
        
        // Agregar los valores con los comodines %
        const params = keys.map(key => `%${where[key]}%`);
        
        return db.query(sql, params);
    }
}

module.exports = Alumno;
