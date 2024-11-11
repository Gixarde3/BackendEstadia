// models/CriterioEvaluacionPuntajes.js
const db = require('../database');

class CriterioEvaluacionPuntajes {
    static findAll() {
        return db.query('SELECT * FROM CriterioEvaluacionPuntajes');
    }

    static findById(id) {
        return db.query('SELECT * FROM CriterioEvaluacionPuntajes WHERE idCriterioEvaluacionPuntajes = ?', [id])
            .then(results => results[0]);
    }

    static create(data) {
        return db.query('INSERT INTO CriterioEvaluacionPuntajes SET ?', data)
            .then(result => ({ id: result.insertId, ...data }));
    }

    static update(id, data) {
        return db.query('UPDATE CriterioEvaluacionPuntajes SET ? WHERE idCriterioEvaluacionPuntajes = ?', [data, id])
            .then(() => ({ id, ...data }));
    }

    static delete(id) {
        return db.query('DELETE FROM CriterioEvaluacionPuntajes WHERE idCriterioEvaluacionPuntajes = ?', [id])
            .then(() => ({ id }));
    }

    static findOne(where) {
        const keys = Object.keys(where);
        const values = keys.map(key => `${key} = ?`);
        const params = keys.map(key => where[key]);
        const sql = `SELECT * FROM CriterioEvaluacionPuntajes WHERE ${values.join(' AND ')}`;
        return db.query(sql, params)
            .then(results => results[0]);
    }

    static find(where) {
        // Asumimos que 'where' es un objeto con clave-valor
        const keys = Object.keys(where);
        const values = keys.map(key => `${key} LIKE ?`);
        
        // Crear la consulta SQL con LIKE
        const sql = `SELECT * FROM CriterioEvaluacionPuntajes WHERE ${values.join(' AND ')}`;
        
        // Agregar los valores con los comodines %
        const params = keys.map(key => `%${where[key]}%`);
        
        return db.query(sql, params);
    }
}

module.exports = CriterioEvaluacionPuntajes;
