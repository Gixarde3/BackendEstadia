// models/PlanEducativo.js
const db = require('../database');

class PlanEducativo {
    static findAll() {
        return db.query('SELECT * FROM PlanEducativo');
    }

    static findById(id) {
        return db.query('SELECT * FROM PlanEducativo WHERE idPlanEducativo = ?', [id])
            .then(results => results[0]);
    }

    static create(data) {
        return db.query('INSERT INTO PlanEducativo SET ?', data)
            .then(result => ({ id: result.insertId, ...data }));
    }

    static update(id, data) {
        return db.query('UPDATE PlanEducativo SET ? WHERE idPlanEducativo = ?', [data, id])
            .then(() => ({ id, ...data }));
    }

    static delete(id) {
        return db.query('DELETE FROM PlanEducativo WHERE idPlanEducativo = ?', [id])
            .then(() => ({ id }));
    }
    static findOne(where) {
        return db.query('SELECT * FROM PlanEducativo WHERE ?', where)
            .then(results => results[0]);
    };
    static find(where) {
        return db.query('SELECT * FROM PlanEducativo WHERE ?', where);
    };
}

module.exports = PlanEducativo;
