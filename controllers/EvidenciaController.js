// controllers/EvidenciaController.js
const models = require('../models');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const GoogleGenerativeAI = require('@google/generative-ai');
const GFS = require('@google/generative-ai/server');
//import { GoogleAIFileManager } from "@google/generative-ai/server";
const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(process.env.API_KEY);
const fileServer = new GFS.GoogleAIFileManager(process.env.API_KEY);

function fileToGenerativePart(path, mimeType) {
    return {
        inlineData: {
            data: Buffer.from(fs.readFileSync(path)).toString("base64"),
            mimeType
        },
    };
}

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
            `You are a professional educator who bases all activities on the book "Evaluación del y para el Aprendizaje: instrumentos y estrategias" (UNAM, 2020). Your task is to create a learning activity that aligns with the following parameters:

            Exit Attribute: ${atributoEgresoTexto}
            Performance Criteria: ${criterioDesempenioTexto}
            Indicator: ${indicadorTexto}
            Evidence Objective: ${objetivoEvidencia}
            Evidence Type: ${tipoEvidencia}

            EVIDENCE DESCRIPTION REQUIREMENTS:
            The description must provide comprehensive instructions including:
            1. Detailed Step-by-Step Process:
            - Precise sequence of actions to complete the activity
            - Preliminary steps or research required
            - Development phases if applicable
            - Final assembly or presentation instructions

            2. Format and Presentation Requirements:
            - Specific document format (if applicable)
            - Required sections and their content
            - Presentation style guidelines
            - Technical specifications (length, format, etc.)

            3. Resources and Materials:
            - Required tools or materials
            - Recommended references or sources
            - Technical requirements
            - Additional support materials

            4. Quality Guidelines:
            - Expected level of detail
            - Professional presentation standards
            - Academic rigor requirements
            - Examples of excellent work characteristics

            5. Submission Instructions:
            - Final delivery format
            - Required documentation
            - Presentation requirements if applicable
            - Additional submission guidelines

            EVALUATION CRITERIA GUIDELINES:

            1. Specificity and Clarity:
            - Each criterion must evaluate ONE single, specific aspect
            - Avoid compound criteria (using "y", "o", "además", etc.)
            - Break down complex aspects into separate criteria
            
            2. Objectivity and Measurability:
            - Define clear, observable indicators
            - For subjective aspects, provide detailed evaluation guides
            - Include specific examples of what constitutes each level of performance
            
            3. Independent Assessment:
            - Each criterion should be independently assessable
            - Avoid overlapping or redundant criteria
            - If similar aspects need evaluation, clearly differentiate what makes each unique

            4. Detailed Performance Descriptions:
            For subjective criteria, include:
            - Specific observable behaviors
            - Concrete examples
            - Measurable indicators
            - Clear differentiation between performance levels

            5. Balanced Evaluation:
            - Percentages must sum exactly 100%
            - Weight distribution should reflect importance and complexity
            - Consider time and effort required for each aspect

            EXAMPLES:

            Poor description:
            "Realizar una presentación sobre energías renovables"
            (Too vague, lacks specific instructions)

            Better description:
            "Desarrollar una presentación multimedia sobre energías renovables que incluya:
            1. Investigación de tres tipos de energías renovables (eólica, solar y biomasa)
            2. Para cada tipo de energía:
            - Principios básicos de funcionamiento
            - Ventajas y desventajas
            - Un caso de estudio real de implementación
            - Análisis de viabilidad en el contexto local
            3. Formato de entrega:
            - Presentación en PowerPoint o similar
            - 15-20 diapositivas
            - Incluir gráficos y diagramas explicativos
            - Referencias en formato APA
            4. Presentación oral:
            - Duración: 15 minutos
            - Uso de lenguaje técnico apropiado
            - Material visual de apoyo
            ..."

            Poor criterion:
            "Presenta el trabajo de manera clara y organizada, con buena ortografía y gramática" 
            (Combines multiple aspects, too general)

            Better criteria broken down:
            1. "Estructura lógica del documento según el formato especificado" (20%)
            Guía: Evalúa la presencia y orden de todas las secciones requeridas: introducción, desarrollo, conclusiones. Cada sección debe estar claramente identificada con títulos y subtítulos.

            2. "Precisión ortográfica en el documento" (15%)
            Guía: Se permite un máximo de 3 errores ortográficos por página. Incluye acentuación y uso de mayúsculas.

            Remember:
            - Provide detailed, actionable instructions
            - Make all requirements explicit
            - Include examples when possible
            - Ensure criteria are specific and measurable
            - Balance the weight distribution appropriately

            Respond in Spanish using formal academic language.`
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
        actividad.idEvidencia = evidencia.idEvidencia;
        await models.Notificacion.create({
            idUsuario: req.body.idUsuario,
            titulo: "Evidencia creada",
            contenido: `Se ha creado una nueva evidencia con el nombre ${actividad.nombre}`
        })
        res.send(actividad);
    }

    static async generateRetroalimentacion(req, res) {
        try{
            const evidenciaEntregada = await models.EvidenciaEntregada.findById(req.body.idEvidenciaEntregada);
            const evidencia = await models.Evidencia.findOne({idEvidencia: evidenciaEntregada.idEvidencia});
            const atributoEgreso = await models.AtributoEgreso.findOne({idAtributoEgreso: evidencia.idAtributoEgreso});
            const criterioDesempenio = await models.CriterioDesempenio.findOne({idCriterioDesempenio: evidencia.idCriterioDesempenio});
            const indicador = await models.Indicador.findOne({idIndicador: evidencia.idIndicador});
            const criteriosEvaluacion = await models.CriterioEvaluacion.find({ idEvidencia: evidencia.idEvidencia });

            const atributoEgresoTexto = atributoEgreso?.descripcion;
            const criterioDesempenioTexto = criterioDesempenio?.descripcion;
            const indicadorTexto = indicador?.descripcion;
            const evidenciaTexto = evidencia?.descripcion;
            const criteriosEvaluacionTexto = criteriosEvaluacion.map(criterio => criterio.descripcion).join('\n');

            const archivosEvidencia = await models.ArchivoEvidenciaEntregada.find({ idEvidenciaEntregada: req.body.idEvidenciaEntregada });
            const archivos = [];
            let hayPDF = false;
            for(const archivo of archivosEvidencia){
                if(archivo.extension !== '.pdf'){
                    continue;
                }
                hayPDF = true;
                const archivoPart = fileToGenerativePart(path.join(__dirname, `../uploads/${archivo.archivo}`), "application/pdf");
                archivos.push(archivoPart);
            }

            if(!hayPDF){
                throw new Error('No se encontró un archivo PDF en la evidencia entregada, por lo tanto no se puede generar retroalimentación');
            }
            const schemaRetroalimentacion = {
                description: "Estructura de una retroalimentación",
                type: GoogleGenerativeAI.SchemaType.OBJECT,
                properties: {
                retroalimentacion: {
                    type: GoogleGenerativeAI.SchemaType.STRING,
                    description: "Retroalimentación de la evidencia",
                    nullable: false,
                },
                criteriosEvaluacion: {
                    type: GoogleGenerativeAI.SchemaType.ARRAY,
                    items: {
                    type: GoogleGenerativeAI.SchemaType.OBJECT,
                    properties: {
                        calificacion:{
                            type: GoogleGenerativeAI.SchemaType.NUMBER,
                            description: "Calificación del criterio de evaluación",
                            nullable: false,
                        }
                    },
                    required: ["calificacion"],
                    },
                    description: "Criterios de evaluación de la retroalimentación",
                    nullable: false,
                },
                },
                required: ["retroalimentacion", "criteriosEvaluacion"],
            };

            const model = genAI.getGenerativeModel({
                model: "gemini-1.5-pro",
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: schemaRetroalimentacion,
                },
            });

            const prompt = `      
                You are a professional evaluator, assessing each submission according to the principles and methodologies described in *Evaluación del y para el Aprendizaje: instrumentos y estrategias* (UNAM, 2020). Your task is to critically evaluate the submitted evidence based on established criteria, ensuring that your assessment remains thorough, accurate, and grounded in evidence.

                ### Evaluation Context:
                - **Exit Attribute:** ${atributoEgresoTexto}
                - **Performance Criteria:** ${criterioDesempenioTexto}
                - **Indicator:** ${indicadorTexto}
                - **Evidence Description:** ${evidenciaTexto}
                - **Evaluation Criteria:** ${criteriosEvaluacionTexto}

                ---

                ### EVALUATION PROCESS:

                1. **Alignment with Evidence Requirements:**
                - Assess how well the submitted evidence aligns with its description, ensuring compliance with format and presentation guidelines.
                - Confirm that all required components are addressed, verifying their relevance to the exit attribute’s objectives.

                2. **Criterion-Specific Assessment:**
                - For each evaluation criterion, analyze the submission in detail:
                    - Identify and highlight specific parts of the evidence that relate directly to the criterion.
                    - Measure the degree of fulfillment (0-100) for each criterion, justifying each score based on observed evidence.
                    - Include concrete examples from the submission that substantiate your rating.
                    - Apply the criterion’s weight to determine the weighted score accurately.

                3. **Scoring Standards and Ranges:**
                - **90-100 (Excellent):** Comprehensive evidence of mastery; exceeds criterion requirements with clear, in-depth understanding.
                - **80-89 (Good):** Substantial evidence of competency; meets most requirements and demonstrates solid understanding.
                - **70-79 (Satisfactory):** Basic competency; fulfills minimum requirements with acceptable understanding.
                - **60-69 (Needs Improvement):** Limited evidence; partially meets requirements, indicating areas of improvement.
                - **0-59 (Insufficient):** Fails to meet basic requirements; lacks essential understanding or evidence.

                4. **Detailed Feedback for Each Score:**
                - Quote relevant sections or examples from the submission to support each score.
                - Provide specific strengths observed and areas for improvement, referencing exact locations within the document.
                - Explain why a perfect score was not assigned, where applicable, and offer actionable steps for improvement.

                ---

                ### EVALUATION PRINCIPLES:

                1. **Objectivity:** Base assessments strictly on observable evidence, maintaining consistency across evaluations.
                2. **Fairness:** Score only according to the criteria provided, disregarding irrelevant factors.
                3. **Specificity:** Support scores with precise examples and references from the document.
                4. **Constructiveness:** Offer improvement suggestions that are actionable and clear, addressing both strengths and weaknesses.

                Respond in formal academic Spanish. Each score must include a detailed rationale, citing examples and justifying all evaluations based on the defined criteria.
            `;

            const result = await model.generateContent(prompt, ...archivos);
            const retroalimentacion = JSON.parse(result.response.text());

            const calificacionesCriterios = retroalimentacion.criteriosEvaluacion;

            for (let i = 0; i < criteriosEvaluacion.length; i++) {
                const calificacion = calificacionesCriterios[i].calificacion;
                const criterioEvaluacionCalificado = await models.CriterioEvaluacionPuntajes.findOne({ idCriterioEvaluacion: criteriosEvaluacion[i].idCriterioEvaluacion, idAlumno: evidenciaEntregada.idAlumno });
                if(criterioEvaluacionCalificado){
                    console.log(calificacion);
                    await models.CriterioEvaluacionPuntajes.update(criterioEvaluacionCalificado.idCriterioEvaluacionPuntajes, {puntaje: calificacion});
                }
                else{
                    await models.CriterioEvaluacionPuntajes.create({idCriterioEvaluacion: criteriosEvaluacion[i].idCriterioEvaluacion, idAlumno: evidenciaEntregada.idAlumno, puntaje: calificacion});
                }
            }
            const idUsuarioAlumno = await models.Alumno.findById(evidenciaEntregada.idAlumno);
            await models.Notificacion.create({idUsuario: idUsuarioAlumno.idUsuario, titulo: 'Se ha generado retroalimentación para una de tus evidencias entregadas', contenido: "Se ha generado retroalimentación para una de tus evidencias entregadas, revisa tus entregas para ver la retroalimentación"});
            await models.RetroalimentacionEvidenciaEntregada.create({idEvidenciaEntregada: req.body.idEvidenciaEntregada, retroalimentacion: retroalimentacion.retroalimentacion});
            res.send(retroalimentacion);
        }catch(error){
            console.log(error);
            res.status(500).send({ error: error.message });
        }
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

    static async getPromedioPorEvidencia(req, res) {
        try {
            const promedio = await models.Evidencia.calcularPromedioPorEvidencia(req.params.idEvidencia);
            res.send(promedio);
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
