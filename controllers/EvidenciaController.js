// controllers/EvidenciaController.js
const models = require('../models');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const GoogleGenerativeAI = require('@google/generative-ai');
//import { GoogleAIFileManager } from "@google/generative-ai/server";
const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(process.env.API_KEY);

class EvidenciaController {
    static async getAll(req, res) {
        try {
            const items = await models.Evidencia.findAll();
            res.send(items);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async getById(req, res) {
        try {
            const item = await models.Evidencia.findById(req.params.id);
            res.send(item);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async create(req, res) {
        try {
            const archivoDescripcion = req.files.archivoDescripcion;
            if(archivoDescripcion){
                const archivoBuffer = fs.readFileSync(archivoDescripcion.path);
                // Nuevo nombre archivo encriptado con md5
                const nombre = crypto.randomBytes(16).toString('hex') + path.extname(archivoDescripcion.name);
                req.body.archivoDescripcion = nombre;
                fs.writeFileSync(path.join(__dirname, `../uploads/${nombre}`), archivoBuffer);
            }else{
                req.body.archivoDescripcion = null;
            }
            const item = await models.Evidencia.create(req.body);
            res.send(item);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async generateEvidencia(req, res) {
        const atributoEgreso = models.AtributoEgreso.findById(req.body.idAtributoEgreso);
        const criterioDesempenio = models.CriterioDesempenio.findAll(req.body.idCriteriosEvaluacion);
        const indicador = models.Indicador.findById(req.body.idIndicador);
        const tipoEvidencia = req.body.tipoEvidencia;
        const schemaEvidencia = {
            description: "Estructura de una evidencia",
            type: GoogleGenerativeAI.SchemaType.OBJECT,
            properties: {
              nombre: {
                type: GoogleGenerativeAI.SchemaType.STRING,
                description: "Nombre de la evidencia",
                nullable: false,
              },
              descripcion: {
                type: GoogleGenerativeAI.SchemaType.STRING,
                description: "Descripción de la evidencia",
                nullable: false,
              },
              objetivo: {
                type: GoogleGenerativeAI.SchemaType.STRING,
                description: "Objetivo de la evidencia",
                nullable: false,
              },
              tiempoLimite: {
                type: GoogleGenerativeAI.SchemaType.NUMBER,
                description: "Tiempo límite de la evidencia en días",
                nullable: true,
              },
              criteriosEvaluacion: {
                type: GoogleGenerativeAI.SchemaType.ARRAY,
                items: {
                  type: GoogleGenerativeAI.SchemaType.OBJECT,
                  properties: {
                    titulo: {
                      type: GoogleGenerativeAI.SchemaType.STRING,
                      description: "Título del criterio de evaluación",
                      nullable: false,
                    },
                    descripcion: {
                      type: GoogleGenerativeAI.SchemaType.STRING,
                      description: "Descripción del criterio de evaluación",
                      nullable: false,
                    },
                    porcentaje_al_final: {
                      type: GoogleGenerativeAI.SchemaType.NUMBER,
                      description: "Valor en porcentaje aportado para el puntaje final de la evidencia",
                      nullable: false,
                    },
                  },
                  required: ["titulo", "descripcion", "porcentaje_al_final"],
                },
                description: "Criterios de evaluación de la evidencia",
                nullable: false,
              },
            },
            required: ["nombre", "descripcion", "objetivo", "criteriosEvaluacion", "tiempoLimite"],
          };
          

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-pro",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: schemaEvidencia,
            },
        });
        
        const atributoEgresoTexto = atributoEgreso.descripcion;
        const criterioDesempenioTexto = criterioDesempenio.descripcion;
        const indicadorTexto = indicador.descripcion;
        const objetivoEvidencia = req.body.objetivo;
        const result = await model.generateContent(
            `You are a professional educator who bases all activities on the book Evaluación del y para el Aprendizaje: instrumentos y estrategias by Melchor Sánchez Mendiola and Adrián Martínez González, edited by Yolanda Fabiola Rodríguez Cházaro, with editorial design by Virginia González Garibay and Karla Patricia Sosa Ramírez (© 2020, Universidad Nacional Autónoma de México, Coordinación de Desarrollo Educativo e Innovación Curricular). 
            
            Your objective now is to create an activity that fulfills the following:
            Exit Attribute: ${atributoEgresoTexto}
            Performance Criteria: ${criterioDesempenioTexto}
            Indicator: ${indicadorTexto}
            Evidence Objective: ${objetivoEvidencia}
            Types of Evidence:
                Producto (large-scale, often a project, individual or team-based)
                Desempeño (brief, individual activities for in-class completion)
                Conocimiento (knowledge assessment exams)

            For this activity, you should use the following type: ${tipoEvidencia}
            Do not rwrite the params in your response, only the content of the activity.
            When defining an evaluation criterion, ensure it is clear, specific, and outlines both what should be achieved and how it will be evaluated. For example: "Clarity and precision in presenting the proposal" can be assessed by determining whether the idea is communicated in a way that is clearly and precisely understood solely from the proposal itself.

            Moreover, evaluation criteria should be specific items that directly assess individual aspects of the activity. Long or complex criteria are not ideal; they should instead be broken down into smaller, focused criteria, each measuring one distinct element of the activity.
            Ensure that the activity aligns with the evidence objective and integrates any additional provided criteria, exit attributes, or indicators to ensure compliance. Respond only in Spanish and maintain a structured, professional tone.`
        );
        const actividad = JSON.parse(result.response.text());
        let fechaEntrega = new Date();
        fechaEntrega.setDate(fechaEntrega.getDate() + actividad.tiempoLimite);
        const evidenciaACrearr ={
            nombre: actividad.nombre,
            descripcion: actividad.descripcion,
            objetivo: actividad.objetivo,
            momento: "sumativa",
            idAtributoEgreso: req.body.idAtributoEgreso ?? null,
            idIndicador: req.body.idIndicador ?? null,
            idCriterioDesempenio: req.body.idCriterioDesempenio ?? null,
            fechaLimite: fechaEntrega.toISOString().slice(0, 19).replace('T', ' '),
            idGrupoMateria: req.body.idGrupoMateria,
            tipo: tipoEvidencia,
            porcentajeFinal: req.body.porcentajeFinal ?? 0,
        }
        const criteriosEvaluacion = actividad.criteriosEvaluacion;
        const evidencia = await models.Evidencia.create(evidenciaACrearr);
        
        for (let i = 0; i < criteriosEvaluacion.length; i++) {
            criteriosEvaluacion[i].idEvidencia = evidencia.idEvidencia;
            await models.CriterioEvaluacion.create(criteriosEvaluacion[i]);
        }
        res.send(evidencia);
    }

    static async update(req, res) {
        try {
            if(req.files && req.files.archivoDescripcion){
                const archivoDescripcion = req.files.archivoDescripcion;
                const archivoBuffer = fs.readFileSync(archivoDescripcion.path);
                // Nuevo nombre archivo encriptado con md5
                const nombre = crypto.randomBytes(16).toString('hex') + path.extname(archivoDescripcion.name);
                req.body.archivoDescripcion = nombre;
                fs.writeFileSync(path.join(__dirname, `../uploads/${nombre}`), archivoBuffer);
            }else{
                const item = await models.Evidencia.findById(req.params.id);
                req.body.archivoDescripcion = item.archivoDescripcion;
            }
            const item = await models.Evidencia.update(req.params.id, req.body);
            res.send(item);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async delete(req, res) {
        try {
            const item = await models.Evidencia.delete(req.params.id);
            res.send(item);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async findOne(req, res) {
        try {
            const item = await models.Evidencia.findOne(req.body);
            res.send(item);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async find(req, res) {
        try {
            const items = await models.Evidencia.find(req.body);
            res.send(items);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }
}

module.exports = EvidenciaController;
