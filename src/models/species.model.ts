import {BuildOptions, DataTypes, Model, Sequelize} from "sequelize";

export interface SpeciesAttributes {
    id?: string;
    name: string;
}

export interface SpeciesModel extends Model<SpeciesAttributes>, SpeciesAttributes {
}

export class Species extends Model<SpeciesModel, SpeciesAttributes> {
}

export type SpeciesStatic = typeof Model & {
    new(values?: object, options?: BuildOptions): SpeciesModel;
};

export function SpeciesFactory(sequelize: Sequelize): SpeciesStatic {
    return <SpeciesStatic>sequelize.define("Species", {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    }, {
        getterMethods: {
            getId() {
                return this._attributes.id;
            }
        },
        freezeTableName: true,
        tableName: 'Species',
        timestamps: false,
        underscored: true,
    })
}