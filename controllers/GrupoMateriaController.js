// controllers/GrupoMateriaController.js
const models = require('../models');
const GoogleGenerativeAI = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(process.env.API_KEY);
class GrupoMateriaController {
    static async getAll(req, res) {
        try {
            const items = await models.GrupoMateria.findAll();
            res.send(items);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async getById(req, res) {
        try {
            const item = await models.GrupoMateria.findById(req.params.id);
            res.send(item);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async create(req, res) {
        try {
            const item = await models.GrupoMateria.create(req.body);
            res.send(item);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async update(req, res) {
        try {
            const item = await models.GrupoMateria.update(req.params.id, req.body);
            res.send(item);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async delete(req, res) {
        try {
            const item = await models.GrupoMateria.delete(req.params.id);
            res.send(item);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async findOne(req, res) {
        try {
            const item = await models.GrupoMateria.findOne(req.body);
            res.send(item);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async find(req, res) {
        try {
            const items = await models.GrupoMateria.find(req.body);
            res.send(items);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async getProximasEntregas(req, res) {
        try{
            const items = await models.Evidencia.findCercaDeEntregar(req.params.id);
            res.send(items);
        }catch(error){
            res.status(500).send({ error: error.message });
        }
    }

    static async getCalificaciones(req, res) {
        try{
            const idGrupoMateria = req.params.id;
            const idAlumno = req.params.idAlumno;
            const items = await models.GrupoMateria.getCalificaciones(idGrupoMateria, idAlumno);
            res.send(items);
        }catch(error){
            res.status(500).send({ error: error.message });
        }
    }

    static async getPorcentajesNoEntrega(req, res) {
        try{
            const idGrupoMateria = req.params.idGrupoMateria;
            const items = await models.GrupoMateria.getPorcentajesNoEntrega(idGrupoMateria);
            res.send(items);
        }catch(error){
            res.status(500).send({ error: error.message });
        }
    }

    static async generarRetroalimentacionMateria(req, res){
        try{
            const idGrupoMateria = req.params.idGrupoMateria;
            const idAlumno = req.params.idAlumno;
            const evidenciaEntregada = await models.EvidenciaEntregada.findEvidenciasEntregadasByAlumnoYGrupo(idAlumno, idGrupoMateria);
            const retroalimentaciones = [] 
            for(const evidencia of evidenciaEntregada){
                console.log(evidencia);
                retroalimentaciones.push(await models.RetroalimentacionEvidenciaEntregada.find({idEvidenciaEntregada: evidencia.idEvidenciaEntregada}));
            }    

            const retroalimentacionesText = retroalimentaciones.map(retroalimentacion => {
                return retroalimentacion[0] ? retroalimentacion[0].retroalimentacion : '';
            }).join('\n');
            const prompt = `
                Based on this feedback or set of feedbacks: ${retroalimentacionesText}

                Generate a report on the set of feedback. This report should highlight the student's strengths as well as areas for improvement. To identify the student's areas for improvement, focus on the most common errors found within the set of feedback. This feedback will serve as a guide for improvement in specific aspects that have been recurring throughout the evidence submitted by this student. Therefore, you should also provide improvement strategies to help enhance the overall quality of the work submitted.
                Always refer to the student as "El/La estudiante". Never try to use its name neither use substitutions like "[Nombre del estudiante]"; just focus in te body of the report.

                The response should be in professional Spanish.
            `;

            console.log(prompt);
            const modelAI = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const response = await modelAI.generateContent(prompt);
            res.send(response.response.text());
        }catch(error){
            res.status(500).send({ error: error.message });
        }
    }
}

module.exports = GrupoMateriaController;
