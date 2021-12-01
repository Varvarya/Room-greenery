import {BuildOptions, DataTypes, Model, Sequelize} from "sequelize";

export interface RoleAttributes {
    id?: number;
    title: string;
}

export const Roles = {
    'user' : 1,
    'moderator' : 2,
    'admin' : 3,
}

export interface RoleModel extends Model<RoleAttributes>, RoleAttributes {
    getRole();
}

export class Role extends Model<RoleModel, RoleAttributes> {
}

export type RoleStatic = typeof Model & {
    new(values?: object, options?: BuildOptions): RoleModel;
};

export function RoleFactory(sequelize: Sequelize): RoleStatic {
    return <RoleStatic>sequelize.define("Role", {
        id: {
            type: DataTypes.NUMBER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
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
        tableName: 'Role',
        timestamps: false,
        underscored: true,
    })
}