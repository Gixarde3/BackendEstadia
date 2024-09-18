const fs = require('fs');
const path = require('path');

// Obtén el nombre del modelo y el nivel de privilegio del argumento de la consola
const modelName = process.argv[2];
const privilegeLevel = process.argv[3];

if (!modelName) {
    console.error('Por favor, proporciona un nombre para el modelo.');
    process.exit(1);
}

if (!privilegeLevel) {
    console.error('Por favor, proporciona un nivel de privilegio para las rutas.');
    process.exit(1);
}

// Define los nombres de los archivos
const modelFileName = `${modelName}.js`;
const controllerFileName = `${modelName}Controller.js`;
const routesFileName = `${modelName}Routes.js`;

// Define las plantillas para los archivos
const modelTemplate = `// models/${modelFileName}
const db = require('../database');

class ${modelName} {
    static findAll() {
        return db.query('SELECT * FROM ${modelName}');
    }

    static findById(id) {
        return db.query('SELECT * FROM ${modelName} WHERE id${modelName} = ?', [id])
            .then(results => results[0]);
    }

    static create(data) {
        return db.query('INSERT INTO ${modelName} SET ?', data)
            .then(result => ({ id: result.insertId, ...data }));
    }

    static update(id, data) {
        return db.query('UPDATE ${modelName} SET ? WHERE id${modelName} = ?', [data, id])
            .then(() => ({ id, ...data }));
    }

    static delete(id) {
        return db.query('DELETE FROM ${modelName} WHERE id${modelName} = ?', [id])
            .then(() => ({ id }));
    }

    static findOne(where) {
        return db.query('SELECT * FROM ${modelName} WHERE ?', where)
            .then(results => results[0]);
    }

    static find(where) {
        // Asumimos que 'where' es un objeto con clave-valor
        const keys = Object.keys(where);
        const values = keys.map(key => \`\${key} LIKE ?\`);
        
        // Crear la consulta SQL con LIKE
        const sql = \`SELECT * FROM ${modelName} WHERE \${values.join(' AND ')}\`;
        
        // Agregar los valores con los comodines %
        const params = keys.map(key => \`%\${where[key]}%\`);
        
        return db.query(sql, params);
    }
}

module.exports = ${modelName};
`;

const controllerTemplate = `// controllers/${controllerFileName}
const models = require('../models');

class ${modelName}Controller {
    static async getAll(req, res) {
        try {
            const items = await models.${modelName}.findAll();
            res.send(items);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async getById(req, res) {
        try {
            const item = await models.${modelName}.findById(req.params.id);
            res.send(item);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async create(req, res) {
        try {
            const item = await models.${modelName}.create(req.body);
            res.send(item);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async update(req, res) {
        try {
            const item = await models.${modelName}.update(req.params.id, req.body);
            res.send(item);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async delete(req, res) {
        try {
            const item = await models.${modelName}.delete(req.params.id);
            res.send(item);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async findOne(req, res) {
        try {
            const item = await models.${modelName}.findOne(req.body);
            res.send(item);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }

    static async find(req, res) {
        try {
            const items = await models.${modelName}.find(req.body);
            res.send(items);
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    }
}

module.exports = ${modelName}Controller;
`;

const routesTemplate = `
const { ${modelName}Controller } = require('../controllers');

router.get('/${modelName.toLowerCase()}s', checkPrivileges([${privilegeLevel}]), ${modelName}Controller.getAll);
router.get('/${modelName.toLowerCase()}/:id', checkPrivileges(1), ${modelName}Controller.getById);
router.post('/${modelName.toLowerCase()}', checkPrivileges([${privilegeLevel}]), ${modelName}Controller.create);
router.put('/${modelName.toLowerCase()}/:id', checkPrivileges([${privilegeLevel}]), ${modelName}Controller.update);
router.delete('/${modelName.toLowerCase()}/:id', checkPrivileges([${privilegeLevel}]), ${modelName}Controller.delete);
router.post('/${modelName.toLowerCase()}/find', checkPrivileges([${privilegeLevel}]), ${modelName}Controller.findOne);
router.post('/${modelName.toLowerCase()}s/findall', checkPrivileges([${privilegeLevel}]), ${modelName}Controller.find);
`;

// Crea los archivos en los directorios correspondientes
fs.writeFile(path.join(__dirname, 'models', modelFileName), modelTemplate, (err) => {
    if (err) {
        console.error('Error al crear el archivo del modelo:', err);
    } else {
        console.log(`Archivo de modelo creado: models/${modelFileName}`);
    }
});

fs.writeFile(path.join(__dirname, 'controllers', controllerFileName), controllerTemplate, (err) => {
    if (err) {
        console.error('Error al crear el archivo del controlador:', err);
    } else {
        console.log(`Archivo de controlador creado: controllers/${controllerFileName}`);
    }
});

// Actualizar el índice de models
const modelsIndexPath = path.join(__dirname, 'models', 'index.js');
fs.readFile(modelsIndexPath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error al leer el índice de models:', err);
    } else {
        const updatedModelsIndex = data + `\nconst ${modelName} = require('./${modelFileName}');\nmodule.exports.${modelName} = ${modelName};`;
        fs.writeFile(modelsIndexPath, updatedModelsIndex, (err) => {
            if (err) {
                console.error('Error al actualizar el índice de models:', err);
            } else {
                console.log('Índice de models actualizado.');
            }
        });
    }
});

// Actualizar el índice de controllers
const controllersIndexPath = path.join(__dirname, 'controllers', 'index.js');
fs.readFile(controllersIndexPath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error al leer el índice de controllers:', err);
    } else {
        const updatedControllersIndex = data + `\nconst ${modelName}Controller = require('./${controllerFileName}');\nmodule.exports.${modelName}Controller = ${modelName}Controller;`;
        fs.writeFile(controllersIndexPath, updatedControllersIndex, (err) => {
            if (err) {
                console.error('Error al actualizar el índice de controllers:', err);
            } else {
                console.log('Índice de controllers actualizado.');
            }
        });
    }
});

// Actualizar el índice de rutas
const routesIndexPath = path.join(__dirname, 'routes', 'index.js');
fs.readFile(routesIndexPath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error al leer el índice de rutas:', err);
    } else {
        const updatedRoutesIndex = data + `\n${routesTemplate}`;
        fs.writeFile(routesIndexPath, updatedRoutesIndex, (err) => {
            if (err) {
                console.error('Error al actualizar el índice de rutas:', err);
            } else {
                console.log('Índice de rutas actualizado.');
            }
        });
    }
});
