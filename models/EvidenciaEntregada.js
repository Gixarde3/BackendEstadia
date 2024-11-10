// models/EvidenciaEntregada.js
const db = require('../database');

class EvidenciaEntregada {
    static findAll() {
        return db.query('SELECT * FROM EvidenciaEntregada');
    }

    static findById(id) {
        return db.query('SELECT * FROM EvidenciaEntregada WHERE idEvidenciaEntregada = ?', [id])
            .then(results => results[0]);
    }

    static create(data) {
        return db.query('INSERT INTO EvidenciaEntregada SET ?', data)
            .then(result => ({ idEvidenciaEntregada: result.insertId, ...data }));
    }

    static update(id, data) {
        return db.query('UPDATE EvidenciaEntregada SET ? WHERE idEvidenciaEntregada = ?', [data, id])
            .then(() => ({ id, ...data }));
    }

    static delete(id) {
        return db.query('DELETE FROM EvidenciaEntregada WHERE idEvidenciaEntregada = ?', [id])
            .then(() => ({ id }));
    }

    static findOne(where) {
        return db.query('SELECT * FROM EvidenciaEntregada WHERE ?', where)
            .then(results => results[0]);
    }

    static find(where) {
        // Asumimos que 'where' es un objeto con clave-valor
        const keys = Object.keys(where);
        const values = keys.map(key => `EvidenciaEntregada.${key} LIKE ?`);
        
        // Crear la consulta SQL con LIKE
        const sql = `SELECT *, CONCAT(Usuario.clave_identificacion, ' | ', Usuario.nombre, ' ', Usuario.apellido_paterno, ' ', Usuario.apellido_materno) AS nombre 
                    FROM EvidenciaEntregada  
                    INNER JOIN Alumno ON Alumno.idAlumno = EvidenciaEntregada.idAlumno
                    INNER JOIN Usuario ON Usuario.idUsuario = Alumno.idUsuario
                    WHERE ${values.join(' AND ')}`;
        
        // Agregar los valores con los comodines %
        const params = keys.map(key => `%${where[key]}%`);
        


        return db.query(sql, params);
    }
}

module.exports = EvidenciaEntregada;
