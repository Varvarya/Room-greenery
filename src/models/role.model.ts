import {BuildOptions, DataTypes, Model, Sequelize} from "sequelize";

export interface RoleAttributes {
    id?: number;
    title: string;
}

export enum Roles {
    User=1,
    Moderator,
    Administrator
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
            type: DataTypes.INTEGER,
            primaryKey: true,
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