// models/Asignatura.js
const db = require('../database');

class Asignatura {
    static findAll() {
        return db.query('SELECT * FROM Asignatura');
    }

    static findById(id) {
        return db.query('SELECT * FROM Asignatura WHERE idAsignatura = ?', [id])
            .then(results => results[0]);
    }

    static create(data) {
        
        return db.query('INSERT INTO Asignatura SET ?', data)
            .then(result => ({ id: result.insertId, ...data }));
    }

    static update(id, data) {
        return db.query('UPDATE Asignatura SET ? WHERE idAsignatura = ?', [data, id])
            .then(() => ({ id, ...data }));
    }

    static delete(id) {
        return db.query('DELETE FROM Asignatura WHERE idAsignatura = ?', [id])
            .then(() => ({ id }));
    }

    static findByCarrera(id) {
        return db.query(`
            SELECT GrupoMateria.idGrupoMateria, Asignatura.*, Grupo.letra, CONCAT(Usuario.nombre, ' ', Usuario.apellido_paterno, ' ', Usuario.apellido_materno) AS nombreProfesor
            FROM GrupoMateria 
            INNER JOIN Profesor ON Profesor.idProfesor = GrupoMateria.idProfesor
            INNER JOIN Grupo ON Grupo.idGrupo = GrupoMateria.idGrupo
            INNER JOIN Usuario ON Usuario.idUsuario = Profesor.idUsuario
            INNER JOIN Asignatura ON Asignatura.idAsignatura = GrupoMateria.idAsignatura
            INNER JOIN PlanEducativo ON PlanEducativo.idPlanEducativo = Asignatura.idPlanEducativo
            INNER JOIN Carrera ON Carrera.idCarrera = PlanEducativo.idCarrera
            INNER JOIN Director ON Director.idDirector = Carrera.idDirector
            WHERE Director.idUsuario = ?`, [id]);
    }

    static findByProfesor(id) {
        return db.query(`
            SELECT GrupoMateria.idGrupoMateria, Asignatura.*, Grupo.letra, CONCAT(Usuario.nombre, ' ', Usuario.apellido_paterno, ' ', Usuario.apellido_materno) AS nombreProfesor
            FROM GrupoMateria 
            INNER JOIN Asignatura ON Asignatura.idAsignatura = GrupoMateria.idAsignatura
            INNER JOIN Grupo ON Grupo.idGrupo = GrupoMateria.idGrupo
            INNER JOIN Profesor ON Profesor.idProfesor = GrupoMateria.idProfesor
            INNER JOIN Usuario ON Usuario.idUsuario = Profesor.idUsuario
            WHERE Profesor.idUsuario = ?`, [id]);
    }

    static findByAlumno(id) {
        return db.query(`
            SELECT GrupoMateria.idGrupoMateria, Asignatura.*, Grupo.letra, CONCAT(Usuario.nombre, ' ', Usuario.apellido_paterno, ' ', Usuario.apellido_materno) AS nombreProfesor
            FROM GrupoMateria 
            INNER JOIN Asignatura ON Asignatura.idAsignatura = GrupoMateria.idAsignatura
            INNER JOIN Grupo ON Grupo.idGrupo = GrupoMateria.idGrupo
            INNER JOIN Profesor ON Profesor.idProfesor = GrupoMateria.idProfesor
            INNER JOIN Usuario ON Usuario.idUsuario = Profesor.idUsuario
            INNER JOIN AlumnoAsignatura ON GrupoMateria.idGrupoMateria = AlumnoAsignatura.idGrupoMateria
            INNER JOIN Alumno ON Alumno.idAlumno = AlumnoAsignatura.idAlumno
            WHERE Alumno.idUsuario = ?`, [id]);
    }

    static findOne(where) {
        return db.query('SELECT * FROM Asignatura WHERE ?', where)
            .then(results => results[0]);
    }

    static find(where) {
        // Asumimos que 'where' es un objeto con clave-valor
        const keys = Object.keys(where);
        const values = keys.map(key => `${key} LIKE ?`);
        
        // Crear la consulta SQL con LIKE
        const sql = `SELECT * FROM Asignatura WHERE ${values.join(' AND ')}`;
        
        // Agregar los valores con los comodines %
        const params = keys.map(key => `%${where[key]}%`);
        
        return db.query(sql, params);
    }    
}

module.exports = Asignatura;
