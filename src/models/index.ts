import dbConfig from "../dbconfig/db.config";
import Sequelize from "sequelize";
import {OrganizationFactory} from "./organization.model";

export const sequelize = new Sequelize.Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: 'postgres',
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

export const Organization = OrganizationFactory(sequelize);