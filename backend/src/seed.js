import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Import Models
import User from './models/User.js';
import Appraisal from './models/Appraisal.js';
import ResearchPaper from './models/ResearchPaper.js';
import BookPublished from './models/BookPublished.js';
import Certificate from './models/Certificate.js';
import EventOrganised from './models/EventOrganised.js';
import Announcement from './models/Announcement.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/academic-appraisal';

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully.');

    // 1. Clean existing records
    console.log('Cleaning existing collection records...');
    await User.deleteMany({});
    await Appraisal.deleteMany({});
    await ResearchPaper.deleteMany({});
    await BookPublished.deleteMany({});
    await Certificate.deleteMany({});
    await EventOrganised.deleteMany({});
    await Announcement.deleteMany({});
    console.log('Database cleaned successfully.');

    // 2. Create Users
    console.log('Seeding dummy users...');
    
    // Create HOD
    const hodUser = await User.create({
      name: 'Dr. Richard Harris',
      email: 'hod@university.edu',
      password: 'password123', // Will be hashed by userSchema pre-save hook
      role: 'HOD',
      department: 'Computer Science',
      designation: 'Professor & Head of Department',
      isActive: true,
    });

    // Create Faculty
    const facultyUser = await User.create({
      name: 'Dr. Sarah Jenkins',
      email: 'faculty@university.edu',
      password: 'password123',
      role: 'Faculty',
      department: 'Computer Science',
      designation: 'Associate Professor',
      isActive: true,
    });

    // Create Student
    const studentUser = await User.create({
      name: 'Alex Johnson',
      email: 'student@university.edu',
      password: 'password123',
      role: 'Student',
      department: 'Computer Science',
      year: '3rd Year',
      registerNumber: 'CS2026001',
      isActive: true,
    });

    console.log('Dummy users seeded successfully.');

    // 3. Create Announcements
    console.log('Seeding announcements...');
    await Announcement.create([
      {
        title: 'Annual Performance Appraisal Submission Deadline',
        content: 'All faculty members are requested to complete and lock their self-appraisal worksheets by August 15th, 2026. HOD reviews will commence thereafter.',
        targetRole: 'Faculty',
        postedBy: hodUser._id,
      },
      {
        title: 'Semester End Course Feedback Live',
        content: 'Students of the Computer Science department can now submit course feedback for the current semester. Feedback submissions are completely anonymous.',
        targetRole: 'Student',
        postedBy: hodUser._id,
      },
      {
        title: 'Department Research Symposium 2026',
        content: 'The CS Department will host its annual Research Symposium on October 5th. All faculty and students are invited to register.',
        targetRole: 'All',
        postedBy: hodUser._id,
      }
    ]);
    console.log('Announcements seeded.');

    // 4. Create Faculty Activities (Publications, Books, Certificates, Events)
    console.log('Seeding faculty research & activity logs...');
    
    // Research Papers
    await ResearchPaper.create([
      {
        faculty: facultyUser._id,
        title: 'Distributed Consensus Protocols in Large-Scale Edge Computing Networks',
        journal: 'IEEE Transactions on Cloud Computing',
        publicationYear: 2025,
        doi: '10.1109/TCC.2025.10425',
        citationCount: 14,
        url: 'https://ieeexplore.ieee.org',
      },
      {
        faculty: facultyUser._id,
        title: 'Automated Code Generation using Large Language Models: A Comprehensive Survey',
        journal: 'ACM Computing Surveys',
        publicationYear: 2026,
        doi: '10.1145/362548',
        citationCount: 22,
        url: 'https://dl.acm.org',
      }
    ]);

    // Books
    await BookPublished.create([
      {
        faculty: facultyUser._id,
        title: 'Modern Architecture of Multi-Agent Systems',
        publisher: 'Springer Nature',
        publicationYear: 2025,
        isbn: '978-3-030-99455-1',
      }
    ]);

    // Certificates
    await Certificate.create([
      {
        faculty: facultyUser._id,
        title: 'Advanced AI and Deep Learning Architecture Certification',
        issuingOrganization: 'Stanford Online / Coursera',
        issueDate: new Date('2025-06-15'),
        credentialId: 'CRED-STAN-DL-99451',
      }
    ]);

    // Events Organized
    await EventOrganised.create([
      {
        faculty: facultyUser._id,
        title: 'National Workshop on Applied Quantum Computing & Cryptography',
        type: 'Workshop',
        startDate: new Date('2025-11-10'),
        endDate: new Date('2025-11-12'),
        role: 'Coordinator',
        participantsCount: 120,
      }
    ]);

    console.log('Faculty activity logs seeded.');

    // 5. Create Appraisal Sheet for Faculty (Submitted By Faculty)
    console.log('Seeding pending Appraisal sheet for Dr. Sarah Jenkins...');
    await Appraisal.create({
      faculty: facultyUser._id,
      academicYear: '2026-2027',
      status: 'Draft',
      selfAppraisal: {
        reportFromDate: '',
        reportToDate: '',
        achievements: '',
        challengesText: '',
        submitted: false,
        submittedAt: null,
      },
      studentFeedback: {
        averageTeachingRating: 4.2,
        averageCourseCoverageRating: 4.5,
        averageApproachabilityRating: 4.1,
        totalResponses: 45,
      },
      peerEvaluations: [
        {
          evaluator: hodUser._id, // Will act as peer evaluator here
          collaborationRating: 4,
          professionalismRating: 5,
          comments: 'Dr. Sarah is an outstanding team collaborator and holds excellent professional standards.',
          submittedAt: new Date(),
        }
      ],
      // HOD Evaluation is not submitted yet so that the HOD can log in and submit it!
      hodEvaluation: {
        submitted: false,
      }
    });

    console.log('Appraisal seeded.');
    console.log('\n======================================================');
    console.log('SEEDED LOGINS FOR DEV TESTING:');
    console.log('------------------------------------------------------');
    console.log('HOD Portal:');
    console.log('  Email:    hod@university.edu');
    console.log('  Password: password123');
    console.log('------------------------------------------------------');
    console.log('Faculty Portal:');
    console.log('  Email:    faculty@university.edu');
    console.log('  Password: password123');
    console.log('------------------------------------------------------');
    console.log('Student Portal:');
    console.log('  Email:    student@university.edu');
    console.log('  Password: password123');
    console.log('======================================================\n');

    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err.message);
    process.exit(1);
  }
};

seedDatabase();
