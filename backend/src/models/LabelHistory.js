const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const LabelHistory = sequelize.define('LabelHistory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  label_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'labels',
      key: 'id'
    }
  },
  label_key: {
    type: DataTypes.STRING,
    allowNull: false
  },
  old_value: {
    type: DataTypes.STRING,
    allowNull: false
  },
  new_value: {
    type: DataTypes.STRING,
    allowNull: false
  },
  changed_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  change_type: {
    type: DataTypes.ENUM('manual', 'chatbot'),
    defaultValue: 'chatbot'
  },
  chatbot_command: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Original chatbot command if applicable'
  }
}, {
  tableName: 'label_history',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  indexes: [
    {
      fields: ['label_id']
    },
    {
      fields: ['changed_by']
    },
    {
      fields: ['created_at']
    }
  ]
});

module.exports = LabelHistory;
