import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.config';

export const Schedule = sequelize.define('Schedule', {
  id: {
    type: DataTypes.UUIDV4,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },  
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  day: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  startHour: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  startMinutes: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  endHour: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  endMinutes: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: false,
});