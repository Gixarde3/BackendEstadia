// models/Usuario.js
const db = require('../database');

class Usuario {
    static findAll() {
        return db.query('SELECT * FROM Usuario');
    }

    static findById(id) {
        return db.query('SELECT * FROM Usuario WHERE idUsuario = ?', [id])
            .then(results => results[0]);
    }

    static create(data) {
        return db.query('INSERT INTO Usuario SET ?', data)
            .then(result => ({ id: result.insertId, ...data }));
    }

    static update(id, data) {
        return db.query('UPDATE Usuario SET ? WHERE idUsuario = ?', [data, id])
            .then(() => ({ id, ...data }));
    }

    static delete(id) {
        return db.query('DELETE FROM Usuario WHERE idUsuario = ?', [id])
            .then(() => ({ id }));
    }

    static findOne(where) {
        return db.query('SELECT * FROM Usuario WHERE ?', where)
            .then(results => results[0]);
    }

    static findByFiltro(filtro) {
        return db.query('SELECT * FROM Usuario WHERE ?', filtro);
    }

    static findByIdentificador(identificador) {
        return db.query('SELECT * FROM Usuario WHERE clave_identificacion = ?', [identificador])
            .then(results => results[0]);
    }

    static findOne(where) {
        return db.query('SELECT * FROM Usuario WHERE ?', where)
            .then(results => results[0]);
    }

    static find(where) {
        return db.query('SELECT * FROM Usuario WHERE ?', where);
    }
    static generateToken(identificador, token){
        let usuario = null;
        this.findByIdentificador(identificador).then((result) => {
            usuario=result;
            if(usuario){
                return db.query('INSERT INTO Recuperacion (idUsuario, token, fecha_expiracion) VALUES (?, ?, ?)', [usuario.idUsuario, token, new Date(Date.now() + 15 * 60 * 1000)])
                    .then(() => ({ token }));
            }else{
                return Promise.reject(new Error('Usuario no encontrado'));
            }
        });   
    }
}

module.exports = Usuario;
