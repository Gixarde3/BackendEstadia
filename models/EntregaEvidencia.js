// models/EntregaEvidencia.js
const db = require('../database');

class EntregaEvidencia {
    static findAll() {
        return db.query('SELECT * FROM EntregaEvidencia');
    }

    static findById(id) {
        return db.query('SELECT * FROM EntregaEvidencia WHERE idEntregaEvidencia = ?', [id])
            .then(results => results[0]);
    }

    static create(data) {
        return db.query('INSERT INTO EntregaEvidencia SET ?', data)
            .then(result => ({ id: result.insertId, ...data }));
    }

    static update(id, data) {
        return db.query('UPDATE EntregaEvidencia SET ? WHERE idEntregaEvidencia = ?', [data, id])
            .then(() => ({ id, ...data }));
    }

    static delete(id) {
        return db.query('DELETE FROM EntregaEvidencia WHERE idEntregaEvidencia = ?', [id])
            .then(() => ({ id }));
    }

    static findOne(where) {
        return db.query('SELECT * FROM EntregaEvidencia WHERE ?', where)
            .then(results => results[0]);
    }

    static find(where) {
        // Asumimos que 'where' es un objeto con clave-valor
        const keys = Object.keys(where);
        const values = keys.map(key => `${key} LIKE ?`);
        
        // Crear la consulta SQL con LIKE
        const sql = `SELECT * FROM EntregaEvidencia WHERE ${values.join(' AND ')}`;
        
        // Agregar los valores con los comodines %
        const params = keys.map(key => `%${where[key]}%`);
        
        return db.query(sql, params);
    }
}

module.exports = EntregaEvidencia;
