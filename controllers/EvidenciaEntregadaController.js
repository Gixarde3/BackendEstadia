// controllers/EvidenciaEntregadaController.js
const models = require('../models');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
class EvidenciaEntregadaController {
    static async getAll(req, res) {
        try {
            const items = await models.EvidenciaEntregada.findAll();
            res.send(items);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async getById(req, res) {
        try {
            const item = await models.EvidenciaEntregada.findById(req.params.id);
            res.send(item);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async create(req, res) {
        try {
            const evidenciaEntregada = await models.EvidenciaEntregada.find({
                idEvidencia: req.body.idEvidencia,
                idAlumno: req.body.idAlumno
            })
            const archivos = req.files.archivos;
            if (evidenciaEntregada.length > 0) {
                const archivosYaEntregados = await models.ArchivoEvidenciaEntregada.find({
                    idEvidenciaEntregada: evidenciaEntregada[0].idEvidenciaEntregada
                });
                if(archivos){
                    if(archivos.length > 1){
                        archivos.forEach(async archivo => {
                            if(archivosYaEntregados.filter(archivoEntregado => archivoEntregado.nombre_original === archivo.originalFilename).length === 0){
                                const archivoBuffer = fs.readFileSync(archivo.path);
                                // Nuevo nombre archivo encriptado con md5
                                const nombre = crypto.randomBytes(16).toString('hex') + path.extname(archivo.name);
                                fs.writeFileSync(path.join(__dirname, `../uploads/${nombre}`), archivoBuffer);
                                await models.ArchivoEvidenciaEntregada.create({
                                    idEvidenciaEntregada: evidenciaEntregada[0].idEvidenciaEntregada,
                                    archivo: nombre,
                                    nombre_original: archivo.originalFilename,
                                    extension: path.extname(archivo.name)
                                })
                            }
                        });
                    }else{
                        const archivo = archivos;
                        console.log(archivo)
                        if(archivosYaEntregados.filter(archivoEntregado => archivoEntregado.nombre_original === archivo.originalFilename).length === 0){
                            const archivoBuffer = fs.readFileSync(archivo.path);
                            // Nuevo nombre archivo encriptado con md5
                            const nombre = crypto.randomBytes(16).toString('hex') + path.extname(archivo.name);
                            fs.writeFileSync(path.join(__dirname, `../uploads/${nombre}`), archivoBuffer);
                            await models.ArchivoEvidenciaEntregada.create({
                                idEvidenciaEntregada: evidenciaEntregada[0].idEvidenciaEntregada,
                                archivo: nombre,
                                nombre_original: archivo.originalFilename,
                                extension: path.extname(archivo.name)
                            })
                        }
                    }
                }
                

                const archivosRecibidosYaExistentes = req.body.archivosYaEntregados ?? [];                
                const archivosAEliminar = archivosYaEntregados.filter(archivo => {
                    if(!Array.isArray(archivosRecibidosYaExistentes)){
                        return archivo.nombre_original !== archivosRecibidosYaExistentes;
                    }
                    return !archivosRecibidosYaExistentes.some(archivoExistente => archivo.nombre_original === archivoExistente)
                });

                archivosAEliminar.forEach(async archivo => {
                    fs.unlinkSync(path.join(__dirname, `../uploads/${archivo.archivo}`));
                    await models.ArchivoEvidenciaEntregada.delete(archivo.idArchivoEvidenciaEntregada);
                });
                const evidencia = await models.Evidencia.findById(req.body.idEvidencia);
                const grupoMateria = await models.GrupoMateria.findById(evidencia.idGrupoMateria);
                const profesor = await models.Profesor.findById(grupoMateria.idProfesor);
                const usuarioNotificacion = await models.Usuario.findById(profesor.idUsuario);
                const notificacion = await models.Notificacion.create({
                    idUsuario: usuarioNotificacion.idUsuario,
                    titulo: 'Nueva evidencia entregada',
                    contenido: `El alumno ${req.body.idAlumno} ha entregado la evidencia ${evidencia.nombre}`,
                });
                
                res.send(evidenciaEntregada[0]);
                return;
            }
            const item = await models.EvidenciaEntregada.create(req.body);
            if(archivos){
                archivos.forEach(async archivo => {
                    const archivoBuffer = fs.readFileSync(archivo.path);
                    // Nuevo nombre archivo encriptado con md5
                    const nombre = crypto.randomBytes(16).toString('hex') + path.extname(archivo.name);
                    fs.writeFileSync(path.join(__dirname, `../uploads/${nombre}`), archivoBuffer);
                    await models.ArchivoEvidenciaEntregada.create({
                        idEvidenciaEntregada: item.idEvidenciaEntregada,
                        archivo: nombre,
                        nombre_original: archivo.originalFilename,
                        extension: path.extname(archivo.name)
                    })
                });
            }
            res.send(item);
            return;
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async update(req, res) {
        try {
            const item = await models.EvidenciaEntregada.update(req.params.id, req.body);
            res.send(item);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async delete(req, res) {
        try {
            const item = await models.EvidenciaEntregada.delete(req.params.id);
            res.send(item);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async findOne(req, res) {
        try {
            const item = await models.EvidenciaEntregada.findOne(req.body);
            res.send(item);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async find(req, res) {
        try {
            const items = await models.EvidenciaEntregada.find(req.body);
            res.send(items);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }
}

module.exports = EvidenciaEntregadaController;
