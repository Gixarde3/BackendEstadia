// models/Director.js
const db = require('../database');

class Director {
    static findAll() {
        return db.query('SELECT * FROM Director');
    }

    static findById(id) {
        return db.query('SELECT * FROM Director WHERE idDirector = ?', [id])
            .then(results => results[0]);
    }

    static create(data) {
        return db.query('INSERT INTO Director SET ?', data)
            .then(result => ({ id: result.insertId, ...data }));
    }

    static update(id, data) {
        return db.query('UPDATE Director SET ? WHERE idDirector = ?', [data, id])
            .then(() => ({ id, ...data }));
    }

    static delete(id) {
        return db.query('DELETE FROM Director WHERE idDirector = ?', [id])
            .then(() => ({ id }));
    }

    static findOne(where) {
        return db.query('SELECT * FROM Director WHERE ?', where)
            .then(results => results[0]);
    }

    static find(where) {
        return db.query('SELECT * FROM Director WHERE ?', where);
    }
}

module.exports = Director;
