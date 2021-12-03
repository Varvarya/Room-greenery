import dbConfig from "../dbconfig/db.config";
import Sequelize from "sequelize";
import {OrganizationFactory} from "./organization.model";
import {UserFactory} from "./user.model";
import {RoleFactory} from "./role.model";


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
export const User = UserFactory(sequelize);
export const Role = RoleFactory(sequelize);
User.belongsTo(Role, {
    foreignKey: 'role_id',
    onDelete: 'CASCADE',
});
User.belongsTo(Organization, {
    foreignKey: {name: 'organization_id', allowNull: true},
    onDelete: 'CASCADE',
})
Role.hasMany(User);
Organization.hasMany(User);