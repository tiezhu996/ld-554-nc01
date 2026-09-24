import { DataTypes, Model, type CreationOptional, type InferAttributes, type InferCreationAttributes } from 'sequelize';
import { sequelize } from '../config/database.js';
import { UserRole, type UserRoleValue } from '../constants/enums.js';

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare username: string;
  declare passwordHash: string;
  declare role: UserRoleValue;
  declare employeeId: number | null;
  declare storeId: number | null;
}

User.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    username: { type: DataTypes.STRING(60), allowNull: false, unique: true },
    passwordHash: { type: DataTypes.STRING(120), allowNull: false },
    role: { type: DataTypes.ENUM(...Object.values(UserRole)), allowNull: false },
    employeeId: { type: DataTypes.INTEGER, allowNull: true },
    storeId: { type: DataTypes.INTEGER, allowNull: true }
  },
  { sequelize, tableName: 'users' }
);
