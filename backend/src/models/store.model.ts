import { DataTypes, Model, type CreationOptional, type InferAttributes, type InferCreationAttributes } from 'sequelize';
import { sequelize } from '../config/database.js';

export class Store extends Model<InferAttributes<Store>, InferCreationAttributes<Store>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare address: string;
  declare managerId: number | null;
  declare status: 'OPEN' | 'RENOVATING' | 'CLOSED';
  declare phone: string;
  declare businessHours: string;
}

Store.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(120), allowNull: false },
    address: { type: DataTypes.STRING(240), allowNull: false },
    managerId: { type: DataTypes.INTEGER, allowNull: true },
    status: { type: DataTypes.ENUM('OPEN', 'RENOVATING', 'CLOSED'), allowNull: false, defaultValue: 'OPEN' },
    phone: { type: DataTypes.STRING(30), allowNull: false },
    businessHours: { type: DataTypes.STRING(80), allowNull: false }
  },
  { sequelize, tableName: 'stores' }
);
