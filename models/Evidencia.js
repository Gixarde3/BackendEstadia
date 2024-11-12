// models/Evidencia.js
const db = require('../database');

class Evidencia {
    static findAll() {
        return db.query('SELECT * FROM Evidencia');
    }

    static findById(id) {
        return db.query('SELECT * FROM Evidencia WHERE idEvidencia = ?', [id])
            .then(results => results[0]);
    }

    static create(data) {
        return db.query('INSERT INTO Evidencia SET ?', data)
            .then(result => ({ idEvidencia: result.insertId, ...data }));
    }

    static update(id, data) {
        return db.query('UPDATE Evidencia SET ? WHERE idEvidencia = ?', [data, id])
            .then(() => ({ id, ...data }));
    }

    static delete(id) {
        return db.query('DELETE FROM Evidencia WHERE idEvidencia = ?', [id])
            .then(() => ({ id }));
    }

    static findOne(where) {
        return db.query('SELECT * FROM Evidencia WHERE ?', where)
            .then(results => results[0]);
    }

    static calcularPromedioPorEvidencia(idEvidencia) {
        const sql = `SELECT sum(calificacion)/count(*) as promedioGrupal
                        FROM (
                            SELECT 
                                Evidencia.idEvidencia,
                                sum(CriterioEvaluacionPuntajes.puntaje * CriterioEvaluacion.porcentaje_al_final / 100) as calificacion
                            FROM CriterioEvaluacionPuntajes
                            INNER JOIN CriterioEvaluacion 
                                ON CriterioEvaluacion.idCriterioEvaluacion = CriterioEvaluacionPuntajes.idCriterioEvaluacion
                            LEFT JOIN Evidencia 
                                ON Evidencia.idEvidencia = CriterioEvaluacion.idEvidencia
                            WHERE Evidencia.idEvidencia = ?
                            GROUP BY CriterioEvaluacionPuntajes.idAlumno
                        ) AS calificaciones_evidencias
                        GROUP BY idEvidencia;`;
        return db.query(sql, [idEvidencia]).then(results => results[0]);
    }

    static find(where) {
        // Asumimos que 'where' es un objeto con clave-valor
        const keys = Object.keys(where);
        const values = keys.map(key => `${key} LIKE ?`);
        
        // Crear la consulta SQL con LIKE
        const sql = `SELECT * FROM Evidencia WHERE ${values.join(' AND ')} ORDER BY idEvidencia DESC`;
        
        // Agregar los valores con los comodines %
        const params = keys.map(key => `%${where[key]}%`);
        
        
        return db.query(sql, params);
    }

    static findCercaDeEntregar(idGrupoMateria){
        return db.query(`
                            SELECT * 
                            FROM Evidencia 
                            WHERE Evidencia.idGrupoMateria = ? 
                            AND Evidencia.fechaLimite <= DATE_ADD(CURDATE(), INTERVAL 7 DAY)`, [idGrupoMateria]);
    }
}

module.exports = Evidencia;
