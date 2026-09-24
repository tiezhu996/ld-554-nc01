import { DataTypes, Model, type CreationOptional, type InferAttributes, type InferCreationAttributes } from 'sequelize';
import { sequelize } from '../config/database.js';
import { ShiftType, type ShiftTypeValue } from '../constants/enums.js';

export class Shift extends Model<InferAttributes<Shift>, InferCreationAttributes<Shift>> {
  declare id: CreationOptional<number>;
  declare employeeId: number;
  declare date: string;
  declare shiftType: ShiftTypeValue;
  declare startTime: string;
  declare endTime: string;
  declare storeId: number;
  declare status: 'PENDING' | 'CONFIRMED' | 'CHECKED_IN';
}

Shift.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    employeeId: { type: DataTypes.INTEGER, allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    shiftType: { type: DataTypes.ENUM(...Object.values(ShiftType)), allowNull: false },
    startTime: { type: DataTypes.TIME, allowNull: false },
    endTime: { type: DataTypes.TIME, allowNull: false },
    storeId: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.ENUM('PENDING', 'CONFIRMED', 'CHECKED_IN'), allowNull: false, defaultValue: 'PENDING' }
  },
  { sequelize, tableName: 'shifts' }
);
