import {BuildOptions, DataTypes, Model, Sequelize} from "sequelize";

export interface HistoryAttributes {
    history_time_id?: number;
    device_id?: string,
    co2_level?: number;
    ground_humidity?: number;
    air_humidity?: number;
    air_temperature?: number;
    light_level?: number;
}

export interface HistoryModel extends Model<HistoryAttributes>, HistoryAttributes {
}

export class History extends Model<HistoryModel, HistoryAttributes> {
}

export type HistoryStatic = typeof Model & {
    new(values?: object, options?: BuildOptions): HistoryModel;
};

export function HistoryFactory(sequelize: Sequelize): HistoryStatic {
    return <HistoryStatic>sequelize.define("History", {
        history_time_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        device_id: {
            type: DataTypes.UUID,
            primaryKey: true,
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
        tableName: 'History',
        timestamps: false,
        underscored: true,
    })
}