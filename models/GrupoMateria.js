// models/GrupoMateria.js
const db = require('../database');

class GrupoMateria {
    static findAll() {
        return db.query('SELECT * FROM GrupoMateria');
    }

    static findById(id) {
        return db.query('SELECT * FROM GrupoMateria WHERE idGrupoMateria = ?', [id])
            .then(results => results[0]);
    }

    static create(data) {
        return db.query('INSERT INTO GrupoMateria SET ?', data)
            .then(result => ({ id: result.insertId, ...data }));
    }

    static update(id, data) {
        return db.query('UPDATE GrupoMateria SET ? WHERE idGrupoMateria = ?', [data, id])
            .then(() => ({ id, ...data }));
    }

    static delete(id) {
        return db.query('DELETE FROM GrupoMateria WHERE idGrupoMateria = ?', [id])
            .then(() => ({ id }));
    }

    static findOne(where) {
        return db.query('SELECT * FROM GrupoMateria WHERE ?', where)
            .then(results => results[0]);
    }

    static findByGrupo(id) {
        return db.query('SELECT * FROM GrupoMateria WHERE idGrupo = ?', [id]);
    }

    static find(where) {
        // Asumimos que 'where' es un objeto con clave-valor
        const keys = Object.keys(where);
        const values = keys.map(key => `Asignatura.${key} LIKE ?`);
        
        // Crear la consulta SQL con LIKE
        const sql = `SELECT GrupoMateria.*, Asignatura.nombre FROM GrupoMateria INNER JOIN Asignatura ON Asignatura.idAsignatura = GrupoMateria.idAsignatura WHERE ${values.join(' AND ')}`;
        
        // Agregar los valores con los comodines %
        const params = keys.map(key => `%${where[key]}%`);
        
        return db.query(sql, params);
    }
}

module.exports = GrupoMateria;
