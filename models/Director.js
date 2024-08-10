// models/Director.js
const db = require('../database');

class Director {
    static findAll() {
        return db.query('SELECT * FROM Director');
    }

    static findById(id) {
        return db.query('SELECT * FROM Director WHERE id = ?', [id])
            .then(results => results[0]);
    }

    static create(data) {
        return db.query('INSERT INTO Director SET ?', data)
            .then(result => ({ id: result.insertId, ...data }));
    }

    static update(id, data) {
        return db.query('UPDATE Director SET ? WHERE id = ?', [data, id])
            .then(() => ({ id, ...data }));
    }

    static delete(id) {
        return db.query('DELETE FROM Director WHERE id = ?', [id])
            .then(() => ({ id }));
    }
}

module.exports = Director;
