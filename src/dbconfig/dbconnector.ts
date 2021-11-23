import { Pool } from 'pg';
import dbConfig from "./db.config";

export default new Pool ({
    max: 20,
    user: dbConfig.USER,
    host: dbConfig.HOST,
    database: dbConfig.DB,
    password: dbConfig.PASSWORD,
    port: 5432,
    idleTimeoutMillis: 30000
});
