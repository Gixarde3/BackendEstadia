const express = require('express');
const path = require('path');
const models = require('../models');
const controllers = require('../controllers');

const router = express.Router();

//Call UserController

// Define your routes here

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

router.get('/usuarios', UsuarioController.getAll);
router.get('/usuario/:id', UsuarioController.getById);
router.post('/usuario', UsuarioController.create);
router.put('/usuario/:id', UsuarioController.update);
router.delete('/usuario/:id', UsuarioController.delete);

const { ProfesorController } = require('../controllers');

router.get('/profesors', ProfesorController.getAll);
router.get('/profesor/:id', ProfesorController.getById);
router.post('/profesor', ProfesorController.create);
router.put('/profesor/:id', ProfesorController.update);
router.delete('/profesor/:id', ProfesorController.delete);


const { DirectorController } = require('../controllers');

router.get('/directors', DirectorController.getAll);
router.get('/director/:id', DirectorController.getById);
router.post('/director', DirectorController.create);
router.put('/director/:id', DirectorController.update);
router.delete('/director/:id', DirectorController.delete);

//
const { CarreraController } = require('../controllers');

router.get('/carreras', CarreraController.getAll);
router.get('/carrera/:id', CarreraController.getById);
router.post('/carrera', CarreraController.create);
router.put('/carrera/:id', CarreraController.update);
router.delete('/carrera/:id', CarreraController.delete);
