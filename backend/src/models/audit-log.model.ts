import { DataTypes, Model, type CreationOptional, type InferAttributes, type InferCreationAttributes } from 'sequelize';
import { sequelize } from '../config/database.js';

export class AuditLog extends Model<InferAttributes<AuditLog>, InferCreationAttributes<AuditLog>> {
  declare id: CreationOptional<number>;
  declare operatorId: number | null;
  declare action: string;
  declare target: string;
  declare oldValue: string | null;
  declare newValue: string | null;
  declare ip: string;
  declare timestamp: CreationOptional<Date>;
}

AuditLog.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    operatorId: { type: DataTypes.INTEGER, allowNull: true },
    action: { type: DataTypes.STRING(80), allowNull: false },
    target: { type: DataTypes.STRING(120), allowNull: false },
    oldValue: { type: DataTypes.TEXT, allowNull: true },
    newValue: { type: DataTypes.TEXT, allowNull: true },
    ip: { type: DataTypes.STRING(60), allowNull: false },
    timestamp: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  },
  { sequelize, tableName: 'audit_logs', updatedAt: false, createdAt: false }
);
