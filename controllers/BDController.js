// controllers/BDController.js

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { exec } = require('child_process');
class BDController{
    static async getDB(req, res){
        const {DB_USER, DB_PASSWORD, DB_NAME} = process.env;
        const filename = `backup_${DB_NAME}_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.sql`;
        const filePath = path.join(__dirname, '../backups', filename);
        const addPassword = DB_PASSWORD ? `-p${DB_PASSWORD}` : '';
        const command = `mysqldump -u ${DB_USER} ${addPassword} --databases ${DB_NAME} > ${filePath}`;

        exec(command, (error, stdout, stderr) => {
            if(error){
                res.status(500).send({error: error.message});
                return;
            }
            res.download(filePath, filename, (err) => {
                if(err){
                    res.status(500).send({error: err.message});
                    return;
                }
            });
        });
    }

    static async loadBD(req, res){
        const {DB_USER, DB_PASSWORD, DB_NAME} = process.env;
        const file = req.files.sql;
        const filePath = file.path;
        const addPassword = DB_PASSWORD ? `-p${DB_PASSWORD}` : '';
        const command = `mysql -u ${DB_USER} ${addPassword} < ${filePath}`;

        exec(command, (error, stdout, stderr) => {
            if(error){
                res.status(500).send({error: error.message});
                return;
            }
            res.send({message: 'Base de datos cargada correctamente'});
        });
    }
}

module.exports = BDController;
