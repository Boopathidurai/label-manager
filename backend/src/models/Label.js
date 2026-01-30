const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Label = sequelize.define('Label', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  label_key: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: 'Unique identifier for the label (never changes)'
  },
  label_value: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Display text (can be changed by admin)'
  },
  page: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Page or section where label appears'
  },
  position: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Display order position'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Description of label purpose'
  },
  updated_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'labels',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      unique: true,
      fields: ['label_key']
    },
    {
      fields: ['page']
    }
  ]
});

module.exports = Label;
