import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Define schemas locally to make the script completely self-contained
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({ path: path.join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/academic-appraisal';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'HOD', 'Faculty', 'Peer', 'Student'], default: 'Faculty' },
  department: { type: String, required: true },
  designation: { type: String },
  isActive: { type: Boolean, default: true }
});

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetRole: { type: String, enum: ['Student', 'Faculty', 'HOD', 'All'], default: 'All' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Announcement = mongoose.model('Announcement', announcementSchema);

async function seed() {
  try {
    console.log(`Connecting to MongoDB at: ${MONGODB_URI}`);
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully!');

    // Clear existing students, faculties, announcements
    console.log('Cleaning up existing demo users and announcements...');
    await User.deleteMany({ email: { $in: [
      'student@university.edu',
      'alice.smith@university.edu',
      'bob.jones@university.edu',
      'charlie.brown@university.edu',
      'admin@university.edu'
    ]}});
    await Announcement.deleteMany({ title: { $in: [
      'Student Feedback Portal is Live',
      'Feedback System Privacy Guarantee'
    ]}});

    // Create password hashes
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // 1. Create Admin (to post announcements)
    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@university.edu',
      password: hashedPassword,
      role: 'Admin',
      department: 'Administration',
      designation: 'IT Director'
    });
    console.log('Created Admin user.');

    // 2. Create Student
    const student = await User.create({
      name: 'John Doe',
      email: 'student@university.edu',
      password: hashedPassword,
      role: 'Student',
      department: 'Computer Science',
      designation: 'Undergraduate'
    });
    console.log('Created Student user (Email: student@university.edu, Password: password123).');

    // 3. Create Faculties
    const faculties = await User.create([
      {
        name: 'Dr. Alice Smith',
        email: 'alice.smith@university.edu',
        password: hashedPassword,
        role: 'Faculty',
        department: 'Computer Science',
        designation: 'Professor'
      },
      {
        name: 'Prof. Bob Jones',
        email: 'bob.jones@university.edu',
        password: hashedPassword,
        role: 'Faculty',
        department: 'Computer Science',
        designation: 'Associate Professor'
      },
      {
        name: 'Dr. Charlie Brown',
        email: 'charlie.brown@university.edu',
        password: hashedPassword,
        role: 'Faculty',
        department: 'Computer Science',
        designation: 'Assistant Professor'
      }
    ]);
    console.log(`Created ${faculties.length} Faculty instructors.`);

    // 4. Create Announcements
    await Announcement.create([
      {
        title: 'Student Feedback Portal is Live',
        content: 'The student appraisal and feedback window is officially open for the current session. Please select your instructors from the dropdown, rate their performance across the five quality areas, and submit your reviews. The deadline is next Friday at 5:00 PM.',
        postedBy: admin._id,
        targetRole: 'Student'
      },
      {
        title: 'Feedback System Privacy Guarantee',
        content: 'We take feedback integrity and student privacy seriously. All evaluation scores and constructive comments are stored anonymously in MongoDB, decoupled from any user account logs. Neither instructors nor HODs can associate feedback scores or comments back to your account.',
        postedBy: admin._id,
        targetRole: 'All'
      }
    ]);
    console.log('Created sample announcements.');

    console.log('Seeding finished successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
