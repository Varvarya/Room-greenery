import {BuildOptions, DataTypes, Model, Sequelize} from "sequelize";

export interface DeviceAttributes {
    id?: string;
    organization_id?: string;
    current_params_id?: string;
    plant_id?: string;
    is_working?: boolean;
}

export interface DeviceModel extends Model<DeviceAttributes>, DeviceAttributes {
}

export class Device extends Model<DeviceModel, DeviceAttributes> {
}

export type DeviceStatic = typeof Model & {
    new(values?: object, options?: BuildOptions): DeviceModel;
};

export function DeviceFactory(sequelize: Sequelize): DeviceStatic {
    return <DeviceStatic>sequelize.define("Device", {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        organization_id: {
            type: DataTypes.UUID,
            allowNull: true,
        },
        current_params_id: {
            type: DataTypes.UUID,
            allowNull: true
        },
        plant_id: {
            type: DataTypes.UUID,
            allowNull: true
        },
        is_working: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        }
    }, {
        freezeTableName: true,
        tableName: 'Device',
        timestamps: false,
        underscored: true,
    })
}