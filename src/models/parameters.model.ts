import {BuildOptions, DataTypes, Model, Sequelize} from "sequelize";

export interface ParamsAttributes {
    id?: number;
    CO2_level: number;
    ground_humidity: number;
    air_humidity: number;
    air_temperature: number;
    light_level: number;
}

export interface ParamsModel extends Model<ParamsAttributes>, ParamsAttributes {
    getRole();
}

export class Params extends Model<ParamsModel, ParamsAttributes> {
}

export type ParamsStatic = typeof Model & {
    new(values?: object, options?: BuildOptions): ParamsModel;
};

export function ParamsFactory(sequelize: Sequelize): ParamsStatic {
    return <ParamsStatic>sequelize.define("Parameters", {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        CO2_level: {
            type: DataTypes.NUMBER,
            allowNull: false,
            defaultValue: 500,
            comment: 'in ppm'
        },
        ground_humidity: {
            type: DataTypes.NUMBER,
            allowNull: false,
            defaultValue: 20,
            comment: 'in percents'
        },
        air_humidity: {
            type: DataTypes.NUMBER,
            allowNull: false,
            defaultValue: 40,
            comment: 'in percents'
        },
        air_temperature: {
            type: DataTypes.NUMBER,
            allowNull: false,
            defaultValue: 25,
            comment: 'in Celsius'
        },
        light_level: {
            type: DataTypes.NUMBER,
            allowNull: false,
            defaultValue: 500,
            comment: 'in Lux'
        }
    }, {
        getterMethods: {
            getId() {
                return this._attributes.id;
            }
        },
        freezeTableName: true,
        tableName: 'Parameters',
        timestamps: false,
        underscored: true,
    })
}