import {BuildOptions, DataTypes, Model, Sequelize} from "sequelize";
import { Roles } from "./role.model";

export interface UserAttributes {
    id?: string;
    name: string;
    surname: string;
    email: string;
    password: string;
    role_id?: number;
    organization_id: string;
}

export interface UserModel extends Model<UserAttributes>, UserAttributes {
    getRole() : Promise<number>;
    setRole(roleId: number) : Promise<UserModel>;
}

export class User extends Model<UserModel, UserAttributes> {
}

export type UserStatic = typeof Model & {
    new(values?: object, options?: BuildOptions): UserModel;
};

export function UserFactory(sequelize: Sequelize): UserStatic {
    return <UserStatic>sequelize.define("User", {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        surname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role_id: {
            type: DataTypes.NUMBER,
            allowNull: false,
            defaultValue: Roles.User,
        },
        organization_id: {
            type: DataTypes.UUID,
            allowNull: true,
        },
    }, {
        getterMethods: {
            fullName() {
                return this._attributes.name + ' ' + this._attributes.surname;
            },
            getRole() {
                return this._attributes.role_id;
            }
        },
        setterMethods: {
            async setRole(roleId) {
                this._attributes.setDataValue('role_id', roleId);
            }
        },
        freezeTableName: true,
        tableName: 'User',
        timestamps: false,
        underscored: true,
    })
}