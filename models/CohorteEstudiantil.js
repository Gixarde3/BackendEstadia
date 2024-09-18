// models/CohorteEstudiantil.js
const db = require('../database');

class CohorteEstudiantil {
    static findAll() {
        return db.query('SELECT * FROM CohorteEstudiantil');
    }

    static findById(id) {
        return db.query('SELECT * FROM CohorteEstudiantil WHERE idCohorteEstudiantil = ?', [id])
            .then(results => results[0]);
    }

    static create(data) {
        return db.query('INSERT INTO CohorteEstudiantil SET ?', data)
            .then(result => ({ id: result.insertId, ...data }));
    }

    static update(id, data) {
        return db.query('UPDATE CohorteEstudiantil SET ? WHERE idCohorteEstudiantil = ?', [data, id])
            .then(() => ({ id, ...data }));
    }

    static delete(id) {
        return db.query('DELETE FROM CohorteEstudiantil WHERE idCohorteEstudiantil = ?', [id])
            .then(() => ({ id }));
    }

    static findOne(where) {
        return db.query('SELECT * FROM CohorteEstudiantil WHERE ?', where)
            .then(results => results[0]);
    }

    static find(where) {
        // Asumimos que 'where' es un objeto con clave-valor
        const keys = Object.keys(where);
        const values = keys.map(key => `${key} LIKE ?`);
        
        // Crear la consulta SQL con LIKE
        const sql = `SELECT * FROM CohorteEstudiantil WHERE ${values.join(' AND ')}`;
        
        // Agregar los valores con los comodines %
        const params = keys.map(key => `%${where[key]}%`);
        
        return db.query(sql, params);
    }
}

module.exports = CohorteEstudiantil;
