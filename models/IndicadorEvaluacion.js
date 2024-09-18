// models/IndicadorEvaluacion.js
const db = require('../database');

class IndicadorEvaluacion {
    static findAll() {
        return db.query('SELECT * FROM IndicadorEvaluacion');
    }

    static findById(id) {
        return db.query('SELECT * FROM IndicadorEvaluacion WHERE idIndicadorEvaluacion = ?', [id])
            .then(results => results[0]);
    }

    static create(data) {
        return db.query('INSERT INTO IndicadorEvaluacion SET ?', data)
            .then(result => ({ id: result.insertId, ...data }));
    }

    static update(id, data) {
        return db.query('UPDATE IndicadorEvaluacion SET ? WHERE idIndicadorEvaluacion = ?', [data, id])
            .then(() => ({ id, ...data }));
    }

    static delete(id) {
        return db.query('DELETE FROM IndicadorEvaluacion WHERE idIndicadorEvaluacion = ?', [id])
            .then(() => ({ id }));
    }

    static findOne(where) {
        return db.query('SELECT * FROM IndicadorEvaluacion WHERE ?', where)
            .then(results => results[0]);
    }

    static find(where) {
        // Asumimos que 'where' es un objeto con clave-valor
        const keys = Object.keys(where);
        const values = keys.map(key => `${key} LIKE ?`);
        
        // Crear la consulta SQL con LIKE
        const sql = `SELECT * FROM IndicadorEvaluacion WHERE ${values.join(' AND ')}`;
        
        // Agregar los valores con los comodines %
        const params = keys.map(key => `%${where[key]}%`);
        
        return db.query(sql, params);
    }
}

module.exports = IndicadorEvaluacion;
