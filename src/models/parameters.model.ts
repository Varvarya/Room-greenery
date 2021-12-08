import {BuildOptions, DataTypes, Model, Sequelize} from "sequelize";

export enum ParamsStatus {
    Critical,
    Bad,
    Normal,
    Good,
    Excellent,
    Perfect
}

export interface ParamsAttributes {
    id?: string;
    co2_level?: number;
    ground_humidity?: number;
    air_humidity?: number;
    air_temperature?: number;
    light_level?: number;
}

export interface ParamsModel extends Model<ParamsAttributes>, ParamsAttributes {
    getRole();
}

export class Params extends Model<ParamsModel, ParamsAttributes> {
    co2_level_aberrance = 10;
    ground_humidity_aberrance = 10;
    air_humidity_aberrance = 10;
    air_temperature_aberrance = 10;
    light_level_aberrance = 10;
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
        co2_level: {
            type: DataTypes.INTEGER,
            defaultValue: 500,
            comment: 'in ppm'
        },
        ground_humidity: {
            type: DataTypes.INTEGER,
            defaultValue: 20,
            comment: 'in percents'
        },
        air_humidity: {
            type: DataTypes.INTEGER,
            defaultValue: 40,
            comment: 'in percents'
        },
        air_temperature: {
            type: DataTypes.INTEGER,
            defaultValue: 25,
            comment: 'in Celsius'
        },
        light_level: {
            type: DataTypes.INTEGER,
            defaultValue: 500,
            comment: 'in Lux'
        }
    }, {
        freezeTableName: true,
        tableName: 'Parameters',
        timestamps: false,
        underscored: true,
    })
}