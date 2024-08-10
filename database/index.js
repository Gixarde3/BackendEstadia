// database/index.js
const mysql = require('mysql');
require('dotenv').config();

class Database {
    constructor() {
        if (!Database.instance) {
            this.pool = mysql.createPool({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                port: process.env.DB_PORT ?? 3306,
                insecureAuth: true
            });

            Database.instance = this;
        }

        return Database.instance;
    }

    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.pool.query(sql, args, (err, rows) => {
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            });
        });
    }
}

const instance = new Database();
Object.freeze(instance);

module.exports = instance;
