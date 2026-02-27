import connectDB from './connection';
import Admin from '../models/Admin';
import Category from '../models/Category';
import Product from '../models/Product';
import bcrypt from 'bcryptjs';

async function seed() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await connectDB();
    console.log('✅ Connected! Starting seed...');

    // Clear existing products and categories (you will create your own)
    console.log('🔄 Clearing existing categories and products...');
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log('✅ Cleared categories and products!');

    // Create default admin only
    const existingAdmin = await Admin.findOne({ email: 'admin@expressdistributors.com' });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await Admin.create({
        email: 'admin@expressdistributors.com',
        password_hash: hashedPassword,
        name: 'Admin User',
        role: 'admin',
      });
      console.log('✅ Default admin created (email: admin@expressdistributors.com, password: admin123)');
    } else {
      console.log('✅ Admin already exists');
    }

    console.log('✅ Seed complete. Add your own categories and products from the admin panel.');
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Seeding failed:', error);
    if (error.message?.includes('MongoServerError') || error.message?.includes('connection')) {
      console.error('\n💡 TIP: Make sure MongoDB is running and MONGODB_URI in .env is correct!');
    }
    process.exit(1);
  }
}

seed();
