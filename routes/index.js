const express = require('express');
const path = require('path');;
const router = express.Router();

// Middleware para verificar privilegios
function checkPrivileges(requiredPrivilege) {
    return (req, res, next) => {
        console.log(req.session);
        console.log(req.sessionID)
        if (!req.session.user) {
            return res.status(401).send('Acceso no autorizado. Por favor inicia sesión.');
        }
        if (!requiredPrivilege.includes(req.session.user.privilege)) {
            return res.status(403).send('Acceso denegado. No tienes los privilegios suficientes.');
        }
        next();
    };
}
// Example route
router.get('/', (req, res) => {
    res.send('Hello, world!');
});

router.get('/test', (req, res) => {
    res.send('This is a test route');
});


// Nueva ruta para obtener la imagen
router.get('/photos/:filename', (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(__dirname, '../photos', filename);
    res.sendFile(filepath, (err) => {
        if (err) {
            res.status(404).send({ error: 'Image not found' });
        }
    });
});

// Nueva ruta para obtener la imagen
router.get('/files/:filename', (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(__dirname, '../files', filename);
    res.sendFile(filepath, (err) => {
        if (err) {
            res.status(404).send({ error: 'File not found' });
        }
    });
});

module.exports = router;

const { UsuarioController } = require('../controllers');

router.get('/usuarios', checkPrivileges([3]), UsuarioController.getAll);
router.get('/usuario/:id', checkPrivileges([3]), UsuarioController.getById);
router.post('/usuario', /*checkPrivileges([3]),*/ UsuarioController.create);
router.put('/usuario/:id', checkPrivileges([3]), UsuarioController.update);
router.delete('/usuario/:id', checkPrivileges([3]), UsuarioController.delete);
router.post('/login', UsuarioController.login);
router.post('/usuario/find', checkPrivileges([3]), UsuarioController.findOne);
router.post('/usuarios/findall', checkPrivileges([3]), UsuarioController.find);
router.post('/solicitar-cambio-contrasena', UsuarioController.solicitarCambioContrasena);
router.post('/cambiar-contrasena', UsuarioController.cambiarContrasena);

const { AlumnoController } = require('../controllers');

router.get('/alumnos', checkPrivileges([3]), AlumnoController.getAll);
router.get('/alumno/:id', checkPrivileges([3]), AlumnoController.getById);
router.post('/alumno', checkPrivileges([3]), AlumnoController.create);
router.put('/alumno/:id', checkPrivileges([3]), AlumnoController.update);
router.delete('/alumno/:id', checkPrivileges([3]), AlumnoController.delete);
router.post('/alumno/find', checkPrivileges([2,3]), AlumnoController.findOne);
router.post('/alumnos/findall', checkPrivileges([2,3]), AlumnoController.find);

const { ProfesorController } = require('../controllers');

router.get('/profesors', checkPrivileges([3]), ProfesorController.getAll);
router.get('/profesor/:id', checkPrivileges([1]), ProfesorController.getById);
router.post('/profesor', checkPrivileges([3]), ProfesorController.create);
router.put('/profesor/:id', checkPrivileges([3]), ProfesorController.update);
router.delete('/profesor/:id', checkPrivileges([3]), ProfesorController.delete);
router.post('/profesor/find', checkPrivileges([3]), ProfesorController.findOne);
router.post('/profesors/findall', checkPrivileges([3]), ProfesorController.find);


const { DirectorController } = require('../controllers');

router.get('/directors',  checkPrivileges([3]), DirectorController.getAll);
router.get('/director/:id', checkPrivileges([3]), DirectorController.getById);
router.post('/director', checkPrivileges([3]), DirectorController.create);
router.put('/director/:id', checkPrivileges([3]), DirectorController.update);
router.delete('/director/:id', checkPrivileges([3]), DirectorController.delete);
router.post('/director/find', checkPrivileges([3]), DirectorController.findOne);
router.post('/directors/findall', checkPrivileges([3]), DirectorController.find);

//
const { CarreraController } = require('../controllers');

router.get('/carreras', checkPrivileges([1,2,3]), CarreraController.getAll);
router.get('/carrera/:id', checkPrivileges([1]), CarreraController.getById);
router.post('/carrera', checkPrivileges([3]), CarreraController.create);
router.put('/carrera/:id', checkPrivileges([3]), CarreraController.update);
router.delete('/carrera/:id', checkPrivileges([3]), CarreraController.delete);
router.post('/carrera/find', checkPrivileges([3]), CarreraController.findOne);
router.post('/carreras/findall', checkPrivileges([3]), CarreraController.find);


const { AsignaturaController } = require('../controllers');

router.get('/asignaturas', checkPrivileges([3]), AsignaturaController.getAll);
router.get('/asignatura/:id', checkPrivileges([1]), AsignaturaController.getById);
router.post('/asignatura', checkPrivileges([3]), AsignaturaController.create);
router.put('/asignatura/:id', checkPrivileges([3]), AsignaturaController.update);
router.delete('/asignatura/:id', checkPrivileges([3]), AsignaturaController.delete);
router.post('/asignatura/find', checkPrivileges([3]), AsignaturaController.findOne);
router.post('/asignaturas/findall', checkPrivileges([3]), AsignaturaController.find);

const { PlanEducativoController } = require('../controllers');

router.get('/planeducativos', checkPrivileges([3]), PlanEducativoController.getAll);
router.get('/planeducativo/:id', checkPrivileges([1]), PlanEducativoController.getById);
router.post('/planeducativo', checkPrivileges([3]), PlanEducativoController.create);
router.put('/planeducativo/:id', checkPrivileges([3]), PlanEducativoController.update);
router.delete('/planeducativo/:id', checkPrivileges([3]), PlanEducativoController.delete);
router.post('/planeducativo/find', checkPrivileges([3]), PlanEducativoController.findOne);
router.post('/planeducativos/findall', checkPrivileges([3]), PlanEducativoController.find);


const { AtributoEgresoController } = require('../controllers');

router.get('/atributoegresos', checkPrivileges([3]), AtributoEgresoController.getAll);
router.get('/atributoegreso/:id', checkPrivileges([1]), AtributoEgresoController.getById);
router.post('/atributoegreso', checkPrivileges([3]), AtributoEgresoController.create);
router.put('/atributoegreso/:id', checkPrivileges([3]), AtributoEgresoController.update);
router.delete('/atributoegreso/:id', checkPrivileges([3]), AtributoEgresoController.delete);
router.post('/atributoegreso/find', checkPrivileges([3]), AtributoEgresoController.findOne);
router.post('/atributoegresos/findall', checkPrivileges([3]), AtributoEgresoController.find);


const { CriterioDesempenioController } = require('../controllers');

router.get('/criteriodesempenios', checkPrivileges([3]), CriterioDesempenioController.getAll);
router.get('/criteriodesempenio/:id', checkPrivileges([1]), CriterioDesempenioController.getById);
router.post('/criteriodesempenio', checkPrivileges([3]), CriterioDesempenioController.create);
router.put('/criteriodesempenio/:id', checkPrivileges([3]), CriterioDesempenioController.update);
router.delete('/criteriodesempenio/:id', checkPrivileges([3]), CriterioDesempenioController.delete);
router.post('/criteriodesempenio/find', checkPrivileges([3]), CriterioDesempenioController.findOne);
router.post('/criteriodesempenios/findall', checkPrivileges([3]), CriterioDesempenioController.find);


const { IndicadorEvaluacionController } = require('../controllers');

router.get('/indicadorevaluacions', checkPrivileges([3]), IndicadorEvaluacionController.getAll);
router.get('/indicadorevaluacion/:id', checkPrivileges([1]), IndicadorEvaluacionController.getById);
router.post('/indicadorevaluacion', checkPrivileges([3]), IndicadorEvaluacionController.create);
router.put('/indicadorevaluacion/:id', checkPrivileges([3]), IndicadorEvaluacionController.update);
router.delete('/indicadorevaluacion/:id', checkPrivileges([3]), IndicadorEvaluacionController.delete);
router.post('/indicadorevaluacion/find', checkPrivileges([3]), IndicadorEvaluacionController.findOne);
router.post('/indicadorevaluacions/findall', checkPrivileges([3]), IndicadorEvaluacionController.find);


const { CohorteEstudiantilController } = require('../controllers');

router.get('/cohorteestudiantils', checkPrivileges([3]), CohorteEstudiantilController.getAll);
router.get('/cohorteestudiantil/:id', checkPrivileges([1]), CohorteEstudiantilController.getById);
router.post('/cohorteestudiantil', checkPrivileges([3]), CohorteEstudiantilController.create);
router.put('/cohorteestudiantil/:id', checkPrivileges([3]), CohorteEstudiantilController.update);
router.delete('/cohorteestudiantil/:id', checkPrivileges([3]), CohorteEstudiantilController.delete);
router.post('/cohorteestudiantil/find', checkPrivileges([3]), CohorteEstudiantilController.findOne);
router.post('/cohorteestudiantils/findall', checkPrivileges([3]), CohorteEstudiantilController.find);


const { GrupoController } = require('../controllers');

router.get('/grupos', checkPrivileges([3]), GrupoController.getAll);
router.get('/grupo/:id', checkPrivileges([1]), GrupoController.getById);
router.post('/grupo', checkPrivileges([3]), GrupoController.create);
router.put('/grupo/:id', checkPrivileges([3]), GrupoController.update);
router.delete('/grupo/:id', checkPrivileges([3]), GrupoController.delete);
router.post('/grupo/find', checkPrivileges([3]), GrupoController.findOne);
router.post('/grupos/findall', checkPrivileges([3]), GrupoController.find);


const { EvidenciaController } = require('../controllers');

router.get('/evidencias', checkPrivileges([2,3]), EvidenciaController.getAll);
router.get('/evidencia/:id', checkPrivileges([1]), EvidenciaController.getById);
router.post('/evidencia', checkPrivileges([2,3]), EvidenciaController.create);
router.put('/evidencia/:id', checkPrivileges([2,3]), EvidenciaController.update);
router.delete('/evidencia/:id', checkPrivileges([2,3]), EvidenciaController.delete);
router.post('/evidencia/find', checkPrivileges([2,3]), EvidenciaController.findOne);
router.post('/evidencias/findall', checkPrivileges([2,3]), EvidenciaController.find);


const { EntregaEvidenciaController } = require('../controllers');

router.get('/entregaevidencias', checkPrivileges([2,3]), EntregaEvidenciaController.getAll);
router.get('/entregaevidencia/:id', checkPrivileges([1]), EntregaEvidenciaController.getById);
router.post('/entregaevidencia', checkPrivileges([1]), EntregaEvidenciaController.create);
router.put('/entregaevidencia/:id', checkPrivileges([1]), EntregaEvidenciaController.update);
router.delete('/entregaevidencia/:id', checkPrivileges([1]), EntregaEvidenciaController.delete);
router.post('/entregaevidencia/find', checkPrivileges([1,2,3]), EntregaEvidenciaController.findOne);
router.post('/entregaevidencias/findall', checkPrivileges([1,2,3]), EntregaEvidenciaController.find);
