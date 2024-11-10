// models/CriterioEvaluacion.js
const db = require('../database');

class CriterioEvaluacion {
    static findAll() {
        return db.query('SELECT * FROM CriterioEvaluacion');
    }

    static findById(id) {
        return db.query('SELECT * FROM CriterioEvaluacion WHERE idCriterioEvaluacion = ?', [id])
            .then(results => results[0]);
    }

    static create(data) {
        return db.query('INSERT INTO CriterioEvaluacion SET ?', data)
            .then(result => ({ id: result.insertId, ...data }));
    }

    static update(id, data) {
        return db.query('UPDATE CriterioEvaluacion SET ? WHERE idCriterioEvaluacion = ?', [data, id])
            .then(() => ({ id, ...data }));
    }

    static delete(id) {
        return db.query('DELETE FROM CriterioEvaluacion WHERE idCriterioEvaluacion = ?', [id])
            .then(() => ({ id }));
    }

    static findOne(where) {
        return db.query('SELECT * FROM CriterioEvaluacion WHERE ?', where)
            .then(results => results[0]);
    }

    static find(where) {
        // Asumimos que 'where' es un objeto con clave-valor
        const keys = Object.keys(where);
        const values = keys.map(key => `${key} LIKE ?`);
        
        // Crear la consulta SQL con LIKE
        const sql = `SELECT * FROM CriterioEvaluacion WHERE ${values.join(' AND ')}`;
        
        // Agregar los valores con los comodines %
        const params = keys.map(key => `%${where[key]}%`);
        
        return db.query(sql, params);
    }
}

module.exports = CriterioEvaluacion;
