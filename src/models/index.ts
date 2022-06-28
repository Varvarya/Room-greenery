import dbConfig from "../dbconfig/db.config";
import Sequelize from "sequelize";
import {OrganizationFactory} from "./organization.model";
import {UserFactory} from "./user.model";
import {RoleFactory} from "./role.model";
import {ParamsFactory} from "./parameters.model";
import {SpeciesFactory} from "./species.model";
import {PlantFactory} from "./plant.model";
import {DeviceFactory} from "./device.model";
import {HistoryFactory} from "./history.model";
import {HistoryTimeFactory} from "./history_time.";


export const sequelize = new Sequelize.Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: 'postgres',
});

export const Organization = OrganizationFactory(sequelize);
export const User = UserFactory(sequelize);
export const Role = RoleFactory(sequelize);
export const Params = ParamsFactory(sequelize);
export const Species = SpeciesFactory(sequelize);
export const Plant = PlantFactory(sequelize);
export const Device = DeviceFactory(sequelize);
export const History = HistoryFactory(sequelize);
export const HistoryTime = HistoryTimeFactory(sequelize);

// One to Many Role-User relationship
User.belongsTo(Role, {
    foreignKey: 'role_id',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});
Role.hasMany(User, {
    foreignKey: 'role_id',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});

// One to Many Organization-User relationship
User.belongsTo(Organization, {
    foreignKey: {name: 'organization_id', allowNull: true},
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
Organization.hasMany(User, {
    foreignKey: 'organization_id',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});

// One to Many Organization-Device relationship
Device.belongsTo(Organization, {
    foreignKey: {name: 'organization_id', allowNull: false},
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
Organization.hasMany(Device, {
    foreignKey: 'organization_id',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});

//One to One Device-Plant relationship
Device.belongsTo(Plant, {
    foreignKey: 'plant_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
Plant.hasOne(Device, {
    foreignKey: 'plant_id',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});

//One to One Device-Params relationship
Device.belongsTo(Params, {
    foreignKey: {
        name: 'current_params_id',
        allowNull: null,
        defaultValue: null
    },
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});
Params.hasOne(Device,{
    foreignKey: 'current_params_id',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});

//One to Many Device-History relationship
History.belongsTo(Device, {
    foreignKey: {name: 'device_id', allowNull: false},
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
Device.hasMany(History, {
    foreignKey: 'device_id',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});

//One to Many History-HistoryTime relationship
History.belongsTo(HistoryTime, {
    foreignKey: {name: 'history_time_id', allowNull: false},
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
HistoryTime.hasMany(History, {
    foreignKey: 'history_time_id',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});

//One to One Plant-Params relationship
Plant.belongsTo(Params, {
    foreignKey: {
        name: 'target_params_id',
        allowNull: null,
        defaultValue: null
    },
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});
Params.hasOne(Plant, {
    foreignKey: 'target_params_id',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});

//One to Many Species-Plant relationship
Plant.belongsTo(Species, {
    foreignKey: 'species_id',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});
Species.hasMany(Plant, {
    foreignKey: 'species_id',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});