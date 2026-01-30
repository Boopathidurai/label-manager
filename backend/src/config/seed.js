require('dotenv').config();
const { sequelize } = require('./database');
const { User, Label } = require('../models');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Create admin user if doesn't exist
    const [admin, created] = await User.findOrCreate({
      where: { email: process.env.ADMIN_EMAIL || 'admin@example.com' },
      defaults: {
        email: process.env.ADMIN_EMAIL || 'admin@example.com',
        password: process.env.ADMIN_PASSWORD || 'admin123',
        role: 'admin',
        is_active: true
      }
    });

    if (created) {
      console.log('✅ Admin user created');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Seed initial labels
    const initialLabels = [
      // Navbar labels
      {
        label_key: 'nav_home',
        label_value: 'Home',
        page: 'navbar',
        position: 1,
        description: 'Navigation link to home page'
      },
      {
        label_key: 'nav_about',
        label_value: 'About',
        page: 'navbar',
        position: 2,
        description: 'Navigation link to about page'
      },
      
      // Home page labels
      {
        label_key: 'home_title',
        label_value: 'Welcome to Our Platform',
        page: 'home',
        position: 1,
        description: 'Main title on home page'
      },
      {
        label_key: 'home_subtitle',
        label_value: 'Transforming Ideas into Reality',
        page: 'home',
        position: 2,
        description: 'Subtitle on home page'
      },
      {
        label_key: 'home_feature1_title',
        label_value: 'Innovation',
        page: 'home',
        position: 3,
        description: 'First feature title'
      },
      {
        label_key: 'home_feature2_title',
        label_value: 'Reliability',
        page: 'home',
        position: 4,
        description: 'Second feature title'
      },
      {
        label_key: 'home_feature3_title',
        label_value: 'Excellence',
        page: 'home',
        position: 5,
        description: 'Third feature title'
      },
      {
        label_key: 'home_cta_button',
        label_value: 'Get Started',
        page: 'home',
        position: 6,
        description: 'Call to action button text'
      },
      
      // About page labels
      {
        label_key: 'about_title',
        label_value: 'About Us',
        page: 'about',
        position: 1,
        description: 'Main title on about page'
      },
      {
        label_key: 'about_section1_title',
        label_value: 'Our Mission',
        page: 'about',
        position: 2,
        description: 'First section title on about page'
      },
      {
        label_key: 'about_section2_title',
        label_value: 'Our Vision',
        page: 'about',
        position: 3,
        description: 'Second section title on about page'
      },
      {
        label_key: 'about_section3_title',
        label_value: 'Our Values',
        page: 'about',
        position: 4,
        description: 'Third section title on about page'
      },
      
      // Admin panel labels
      {
        label_key: 'admin_dashboard_title',
        label_value: 'Admin Dashboard',
        page: 'admin',
        position: 1,
        description: 'Admin dashboard title'
      },
      {
        label_key: 'admin_chatbot_title',
        label_value: 'Label Management Chatbot',
        page: 'admin',
        position: 2,
        description: 'Chatbot panel title'
      }
    ];

    for (const labelData of initialLabels) {
      await Label.findOrCreate({
        where: { label_key: labelData.label_key },
        defaults: labelData
      });
    }

    console.log('✅ Initial labels seeded');
    console.log('\n📋 Default credentials:');
    console.log(`   Email: ${process.env.ADMIN_EMAIL || 'admin@example.com'}`);
    console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);
    console.log('\n✅ Database seeding completed successfully');

    process.exit(0);

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
