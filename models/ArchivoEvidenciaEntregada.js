// models/ArchivoEvidenciaEntregada.js
const db = require('../database');

class ArchivoEvidenciaEntregada {
    static findAll() {
        return db.query('SELECT * FROM ArchivoEvidenciaEntregada');
    }

    static findById(id) {
        return db.query('SELECT * FROM ArchivoEvidenciaEntregada WHERE idArchivoEvidenciaEntregada = ?', [id])
            .then(results => results[0]);
    }

    static create(data) {
        return db.query('INSERT INTO ArchivoEvidenciaEntregada SET ?', data)
            .then(result => ({ id: result.insertId, ...data }));
    }

    static update(id, data) {
        return db.query('UPDATE ArchivoEvidenciaEntregada SET ? WHERE idArchivoEvidenciaEntregada = ?', [data, id])
            .then(() => ({ id, ...data }));
    }

    static delete(id) {
        return db.query('DELETE FROM ArchivoEvidenciaEntregada WHERE idArchivoEvidenciaEntregada = ?', [id])
            .then(() => ({ id }));
    }

    static findOne(where) {
        return db.query('SELECT * FROM ArchivoEvidenciaEntregada WHERE ?', where)
            .then(results => results[0]);
    }

    static find(where) {
        // Asumimos que 'where' es un objeto con clave-valor
        const keys = Object.keys(where);
        const values = keys.map(key => `${key} LIKE ?`);
        
        // Crear la consulta SQL con LIKE
        const sql = `SELECT * FROM ArchivoEvidenciaEntregada WHERE ${values.join(' AND ')}`;
        
        // Agregar los valores con los comodines %
        const params = keys.map(key => `%${where[key]}%`);
        
        return db.query(sql, params);
    }
}

module.exports = ArchivoEvidenciaEntregada;
