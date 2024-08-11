const express = require('express');
const path = require('path');;
const router = express.Router();

// Middleware para verificar privilegios
function checkPrivileges(requiredPrivilege) {
    return (req, res, next) => {
        if (!req.session.user) {
            return res.status(401).send('Acceso no autorizado. Por favor inicia sesión.');
        }else{
            req.session.cookie.maxAge = 15 * 60 * 1000;
        }
        if (req.session.user.privilege < requiredPrivilege) {
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

router.get('/usuarios', checkPrivileges(3), UsuarioController.getAll);
router.get('/usuario/:id', checkPrivileges(1), UsuarioController.getById);
router.post('/usuario', /*checkPrivileges(3),*/ UsuarioController.create);
router.put('/usuario/:id', checkPrivileges(3), UsuarioController.update);
router.delete('/usuario/:id', checkPrivileges(3), UsuarioController.delete);
router.post('/login', UsuarioController.login);

const { ProfesorController } = require('../controllers');

router.get('/profesors', checkPrivileges(3), ProfesorController.getAll);
router.get('/profesor/:id', checkPrivileges(1), ProfesorController.getById);
router.post('/profesor', checkPrivileges(3), ProfesorController.create);
router.put('/profesor/:id', checkPrivileges(3), ProfesorController.update);
router.delete('/profesor/:id', checkPrivileges(3), ProfesorController.delete);


const { DirectorController } = require('../controllers');

router.get('/directors',  checkPrivileges(3), DirectorController.getAll);
router.get('/director/:id', checkPrivileges(1), DirectorController.getById);
router.post('/director', checkPrivileges(3), DirectorController.create);
router.put('/director/:id', checkPrivileges(3), DirectorController.update);
router.delete('/director/:id', checkPrivileges(3), DirectorController.delete);

//
const { CarreraController } = require('../controllers');

router.get('/carreras', checkPrivileges(1), CarreraController.getAll);
router.get('/carrera/:id', checkPrivileges(1), CarreraController.getById);
router.post('/carrera', checkPrivileges(3), CarreraController.create);
router.put('/carrera/:id', checkPrivileges(3), CarreraController.update);
router.delete('/carrera/:id', checkPrivileges(3), CarreraController.delete);


const { AsignaturaController } = require('../controllers');

router.get('/asignaturas', checkPrivileges(3), AsignaturaController.getAll);
router.get('/asignatura/:id', checkPrivileges(1), AsignaturaController.getById);
router.post('/asignatura', checkPrivileges(3), AsignaturaController.create);
router.put('/asignatura/:id', checkPrivileges(3), AsignaturaController.update);
router.delete('/asignatura/:id', checkPrivileges(3), AsignaturaController.delete);

