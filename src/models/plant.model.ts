import {BuildOptions, DataTypes, Model, Sequelize} from "sequelize";

export interface PlantAttributes {
    id?: string;
    species_id?: string;
    target_params_id?: string;
}

export interface PlantModel extends Model<PlantAttributes>, PlantAttributes {
}

export class Plant extends Model<PlantModel, PlantAttributes> {
}

export type PlantStatic = typeof Model & {
    new(values?: object, options?: BuildOptions): PlantModel;
};

export function PlantFactory(sequelize: Sequelize): PlantStatic {
    return <PlantStatic>sequelize.define("Plant", {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        species_id: {
            type: DataTypes.UUID,
            allowNull: true
        },
        target_params_id: {
            type: DataTypes.UUID,
            allowNull: true
        },
    }, {
        freezeTableName: true,
        tableName: 'Plant',
        timestamps: false,
        underscored: true,
    })
}