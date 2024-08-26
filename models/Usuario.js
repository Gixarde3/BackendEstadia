// models/Usuario.js
const db = require('../database');

class Usuario {

    /**
     * @returns {Promise<Array>} Arreglo de todos los usuario
     */
    static findAll() {
        return db.query('SELECT * FROM Usuario');
    }

    /**
     * @param {number} id id del usuario
     * @returns {Promise<Object>} Usuario con el id especificado
     */

    static findById(id) {
        return db.query('SELECT * FROM Usuario WHERE idUsuario = ?', [id])
            .then(results => results[0]);
    }

    /**
     * 
     * @param {*} data toda la información del usuario a añadir
     * @returns el id del usuario ingresado, y la información agregada
     */

    static create(data) {
        return db.query('INSERT INTO Usuario SET ?', data)
            .then(result => ({ id: result.insertId, ...data }));
    }

    /**
     * @param {number} id id del usuario a actualizar
     * @param {*} data información a actualizar
     * @returns el id del usuario actualizado, y la información actualizada
     **/ 
    static update(id, data) {
        return db.query('UPDATE Usuario SET ? WHERE idUsuario = ?', [data, id])
            .then(() => ({ id, ...data }));
    }

    /**
     * @param {number} id id del usuario a eliminar
     * @returns el id del usuario eliminado
     * */
    static delete(id) {
        return db.query('DELETE FROM Usuario WHERE idUsuario = ?', [id])
            .then(() => ({ id }));
    }

    /**
     * 
     * @param {*} where Condición de búsqueda
     * @returns usuario encontrado
     */
    static findOne(where) {
        return db.query('SELECT * FROM Usuario WHERE ?', where)
            .then(results => results[0]);
    }

    /**
     * @param {*} where Condición de búsqueda
     * @returns usuarios encontrados
     * */
    static findByFiltro(filtro) {
        return db.query('SELECT * FROM Usuario WHERE ?', filtro);
    }

    /**
     * @param {*} where Condición de búsqueda
     * @returns usuarios encontrados
     * */

    static findByIdentificador(identificador) {
        return db.query('SELECT * FROM Usuario WHERE clave_identificacion = ?', [identificador])
            .then(results => results[0]);
    }

    /**
     * @param {*} where Condición de búsqueda
     * @returns usuarios encontrados
     * */

    static find(where) {
        // Asumimos que 'where' es un objeto con clave-valor
        const keys = Object.keys(where);
        const values = keys.map(key => `${key} LIKE ?`);
        
        // Crear la consulta SQL con LIKE
        const sql = `SELECT * FROM Usuario WHERE ${values.join(' AND ')}`;
        
        // Agregar los valores con los comodines %
        const params = keys.map(key => `%${where[key]}%`);
        
        return db.query(sql, params);
    }    

    /**
     * @param {*} identificador
     * @param {*} token
     * @returns token generado
     * */
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
