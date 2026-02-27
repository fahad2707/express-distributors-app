import connectDB from './connection';
import Admin from '../models/Admin';
import bcrypt from 'bcryptjs';

async function migrate() {
  try {
    await connectDB();
    
    // Create default admin user if it doesn't exist
    const existingAdmin = await Admin.findOne({ email: 'admin@expressdistributors.com' });
    
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await Admin.create({
        email: 'admin@expressdistributors.com',
        password_hash: hashedPassword,
        name: 'Admin User',
        role: 'admin',
      });
      console.log('✅ Default admin created');
      console.log('   Email: admin@expressdistributors.com');
      console.log('   Password: admin123');
    } else {
      console.log('✅ Admin user already exists');
    }
    
    console.log('✅ Migration completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
