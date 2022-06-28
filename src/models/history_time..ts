import {BuildOptions, DataTypes, Model, Sequelize} from "sequelize";

export interface HistoryTimeAttributes {
    id?: number;
    date_time: string,
}

export interface HistoryTimeModel extends Model<HistoryTimeAttributes>, HistoryTimeAttributes {
}

export class HistoryTime extends Model<HistoryTimeModel, HistoryTimeAttributes> {
}

export type HistoryTimeStatic = typeof Model & {
    new(values?: object, options?: BuildOptions): HistoryTimeModel;
};

export function HistoryTimeFactory(sequelize: Sequelize): HistoryTimeStatic {
    return <HistoryTimeStatic>sequelize.define("HistoryTime", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        dateTime: {
            type: 'TIMESTAMP',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false,
        },
    }, {
        freezeTableName: true,
        tableName: 'HistoryTime',
        timestamps: false,
        underscored: true,
    })
}