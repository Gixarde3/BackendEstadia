// models/CriterioDesempenio.js
const db = require('../database');

class CriterioDesempenio {
    static findAll() {
        return db.query('SELECT * FROM CriterioDesempenio');
    }

    static findById(id) {
        return db.query('SELECT * FROM CriterioDesempenio WHERE idCriterioDesempenio = ?', [id])
            .then(results => results[0]);
    }

    static create(data) {
        return db.query('INSERT INTO CriterioDesempenio SET ?', data)
            .then(result => ({ id: result.insertId, ...data }));
    }

    static update(id, data) {
        return db.query('UPDATE CriterioDesempenio SET ? WHERE idCriterioDesempenio = ?', [data, id])
            .then(() => ({ id, ...data }));
    }

    static delete(id) {
        return db.query('DELETE FROM CriterioDesempenio WHERE idCriterioDesempenio = ?', [id])
            .then(() => ({ id }));
    }

    static findOne(where) {
        return db.query('SELECT * FROM CriterioDesempenio WHERE ?', where)
            .then(results => results[0]);
    }

    static find(where) {
        // Asumimos que 'where' es un objeto con clave-valor
        const keys = Object.keys(where);
        const values = keys.map(key => `${key} LIKE ?`);
        
        // Crear la consulta SQL con LIKE
        const sql = `SELECT * FROM CriterioDesempenio WHERE ${values.join(' AND ')}`;
        
        // Agregar los valores con los comodines %
        const params = keys.map(key => `%${where[key]}%`);
        
        return db.query(sql, params);
    }
}

module.exports = CriterioDesempenio;
