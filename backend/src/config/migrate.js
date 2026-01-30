require('dotenv').config();
const { sequelize } = require('./database');
const { User, Label, LabelHistory } = require('../models');

const runMigrations = async () => {
  try {
    console.log('🔄 Starting database migrations...');

    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');

    // Sync all models (creates tables if they don't exist)
    await sequelize.sync({ force: false, alter: true });
    console.log('✅ Database tables synchronized');

    console.log('✅ Migrations completed successfully');
    process.exit(0);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

runMigrations();
