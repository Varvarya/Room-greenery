import dbConfig from "../dbconfig/db.config";
import Sequelize from "sequelize";
import {OrganizationFactory} from "./organization.model";
import {UserFactory} from "./user.model";
import {RoleFactory} from "./role.model";
import {ParamsFactory} from "./parameters.model";
import {SpeciesFactory} from "./species.model";
import {PlantFactory} from "./plant.model";
import {DeviceFactory} from "./device.model";


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
export const Params = ParamsFactory(sequelize);
export const Species = SpeciesFactory(sequelize);
export const Plant = PlantFactory(sequelize);
export const Device = DeviceFactory(sequelize);

// One to Many Role-User relationship
User.belongsTo(Role, {
    foreignKey: 'role_id',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});
Role.hasMany(User);

// One to Many Organization-User relationship
User.belongsTo(Organization, {
    foreignKey: {name: 'organization_id', allowNull: true},
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
Organization.hasMany(User);

// One to Many Organization-Device relationship
Device.belongsTo(Organization, {
    foreignKey: {name: 'organization_id', allowNull: false},
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
Organization.hasMany(Device);

//One to One Device-Plant relationship
Device.hasOne(Plant, {
    foreignKey: 'plant_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
Plant.belongsTo(Device);

//One to One Device-Params relationship
Device.hasOne(Params, {
    foreignKey: 'current_params_id',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});
Params.belongsTo(Device);

//One to One Plant-Params relationship
Plant.hasOne(Params, {
    foreignKey: 'target_params_id',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});
Params.belongsTo(Plant);

//One to Many Species-Plant relationship
Plant.belongsTo(Species, {
    foreignKey: 'species_id',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});
Species.hasMany(Plant);