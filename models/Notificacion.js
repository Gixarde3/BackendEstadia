// models/Notificacion.js
const db = require('../database');

class Notificacion {
    static findAll() {
        return db.query('SELECT * FROM Notificacion');
    }

    static findById(id) {
        return db.query('SELECT * FROM Notificacion WHERE idNotificacion = ?', [id])
            .then(results => results[0]);
    }

    static create(data) {
        return db.query('INSERT INTO Notificacion SET ?', data)
            .then(result => ({ id: result.insertId, ...data }));
    }

    static update(id, data) {
        return db.query('UPDATE Notificacion SET ? WHERE idNotificacion = ?', [data, id])
            .then(() => ({ id, ...data }));
    }

    static delete(id) {
        return db.query('DELETE FROM Notificacion WHERE idNotificacion = ?', [id])
            .then(() => ({ id }));
    }

    static findOne(where) {
        return db.query('SELECT * FROM Notificacion WHERE ?', where)
            .then(results => results[0]);
    }

    static find(where) {
        // Asumimos que 'where' es un objeto con clave-valor
        const keys = Object.keys(where);
        const values = keys.map(key => `${key} = ?`);
        
        // Crear la consulta SQL con LIKE
        const sql = `SELECT * FROM Notificacion WHERE ${values.join(' AND ')}`;
        
        // Agregar los valores con los comodines %
        const params = keys.map(key => `${where[key]}`);
        
        return db.query(sql, params);
    }
}

module.exports = Notificacion;
