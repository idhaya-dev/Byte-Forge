import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import connectDB from './db.js';

import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables dynamically relative to this script
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../backend/.env') });

const demoUsers = [
  {
    name: 'Rahul Kumar',
    registerNumber: '23IT001',
    email: 'student@college.edu',
    password: 'Student@123',
    role: 'Student', // Mapped to match model enum
    department: 'Information Technology',
  },
  {
    name: 'Dr. Anita Sharma',
    registerNumber: 'FAC001', // Stored in registerNumber field
    email: 'faculty@college.edu',
    password: 'Faculty@123',
    role: 'Faculty', // Mapped to match model enum
    designation: 'Assistant Professor',
    department: 'Information Technology',
  },
  {
    name: 'Dr. Rajesh Kumar',
    registerNumber: 'HOD001', // Stored in registerNumber field
    email: 'hod@college.edu',
    password: 'Hod@123',
    role: 'HOD', // Mapped to match model enum
    designation: 'Professor & HOD',
    department: 'Information Technology',
  }
];

const seedUsers = async () => {
  try {
    // Connect to database
    await connectDB();

    console.log('\n[Seed] Beginning demo user recreate/update process...');

    for (const u of demoUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: u.email.toLowerCase() });

      if (existingUser) {
        console.log(`[Seed] User already exists: ${u.email} (${u.role}). Updating password with newly generated bcrypt hash...`);
        existingUser.password = u.password; // Triggers the schema pre-save hashing hook
        
        // Also update design/dept in case they changed
        existingUser.name = u.name;
        existingUser.registerNumber = u.registerNumber;
        existingUser.department = u.department;
        if (u.designation) {
          existingUser.designation = u.designation;
        }

        await existingUser.save();
        console.log(`[Seed] Successfully updated password hash for: ${u.email}`);
      } else {
        // Create user (password will be automatically hashed by User schema pre-save hook)
        const newUser = await User.create(u);
        console.log(`[Seed] Successfully created user: ${newUser.email} (${newUser.role})`);
      }
    }

    console.log('[Seed] Recreate/update process completed successfully.\n');
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Critical seeding error:', error.message);
    process.exit(1);
  }
};

seedUsers();
