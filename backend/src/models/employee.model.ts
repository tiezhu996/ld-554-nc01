import { DataTypes, Model, type InferAttributes, type InferCreationAttributes, type CreationOptional } from 'sequelize';
import { sequelize } from '../config/database.js';
import { EmployeeStatus, UserRole, type EmployeeStatusValue, type UserRoleValue } from '../constants/enums.js';

export class Employee extends Model<InferAttributes<Employee>, InferCreationAttributes<Employee>> {
  declare id: CreationOptional<number>;
  declare employeeNo: string;
  declare name: string;
  declare department: string;
  declare position: string;
  declare phone: string;
  declare email: string;
  declare joinDate: string;
  declare status: EmployeeStatusValue;
  declare salary: number;
  declare role: UserRoleValue;
  declare storeId: number | null;
}

Employee.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    employeeNo: { type: DataTypes.STRING(32), allowNull: false, unique: true },
    name: { type: DataTypes.STRING(60), allowNull: false },
    department: { type: DataTypes.STRING(60), allowNull: false },
    position: { type: DataTypes.STRING(60), allowNull: false },
    phone: { type: DataTypes.STRING(30), allowNull: false },
    email: { type: DataTypes.STRING(120), allowNull: false },
    joinDate: { type: DataTypes.DATEONLY, allowNull: false },
    status: { type: DataTypes.ENUM(...Object.values(EmployeeStatus)), allowNull: false },
    salary: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    role: { type: DataTypes.ENUM(...Object.values(UserRole)), allowNull: false },
    storeId: { type: DataTypes.INTEGER, allowNull: true }
  },
  { sequelize, tableName: 'employees' }
);
