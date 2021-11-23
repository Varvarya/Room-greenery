import {BuildOptions, DataTypes, Model, Sequelize} from "sequelize";

export interface OrganizationAttributes {
    id?: string;
    title: string;
}

export interface OrganizationModel extends Model<OrganizationAttributes>, OrganizationAttributes {
}

export class Organization extends Model<OrganizationModel, OrganizationAttributes> {
}

export type OrganizationStatic = typeof Model & {
    new(values?: object, options?: BuildOptions): OrganizationModel;
};

export function OrganizationFactory(sequelize: Sequelize): OrganizationStatic {
    return <OrganizationStatic>sequelize.define("Organization", {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        freezeTableName: true,
        tableName: 'Organization',
        timestamps: false
    })
}