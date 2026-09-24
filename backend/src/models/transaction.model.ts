import { DataTypes, Model, type CreationOptional, type InferAttributes, type InferCreationAttributes } from 'sequelize';
import { sequelize } from '../config/database.js';
import {
  TransactionCategory,
  TransactionType,
  type TransactionCategoryValue,
  type TransactionTypeValue
} from '../constants/enums.js';

export class Transaction extends Model<InferAttributes<Transaction>, InferCreationAttributes<Transaction>> {
  declare id: CreationOptional<number>;
  declare type: TransactionTypeValue;
  declare category: TransactionCategoryValue;
  declare amount: number;
  declare description: string;
  declare relatedEmployeeId: number | null;
  declare storeId: number;
  declare date: string;
  declare receipt: string | null;
  declare reviewed: CreationOptional<boolean>;
}

Transaction.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    type: { type: DataTypes.ENUM(...Object.values(TransactionType)), allowNull: false },
    category: { type: DataTypes.ENUM(...Object.values(TransactionCategory)), allowNull: false },
    amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    relatedEmployeeId: { type: DataTypes.INTEGER, allowNull: true },
    storeId: { type: DataTypes.INTEGER, allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    receipt: { type: DataTypes.STRING(255), allowNull: true },
    reviewed: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
  },
  { sequelize, tableName: 'transactions' }
);
