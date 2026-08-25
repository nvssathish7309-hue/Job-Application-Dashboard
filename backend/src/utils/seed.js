const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');
const Candidate = require('../models/Candidate');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Interview = require('../models/Interview');
const InterviewFeedback = require('../models/InterviewFeedback');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');

const { saveUserToPersistentStore, syncPersistentUsersToDB } = require('./userStorage');

const runSeedLogic = async () => {
  console.log('Clearing existing database collections...');
  await User.deleteMany({});
  await Candidate.deleteMany({});
  await Job.deleteMany({});
  await Application.deleteMany({});
  await Interview.deleteMany({});
  await InterviewFeedback.deleteMany({});
  await Notification.deleteMany({});
  await AuditLog.deleteMany({});

  console.log('Seeding default team & admin users...');
  const adminUser = await User.create({
    firstName: 'Super',
    lastName: 'Admin',
    email: 'admin@mindmatrix.com',
    password: 'Sathish@29',
    role: 'SUPER_ADMIN',
    department: 'Executive',
    phone: '9876543210'
  });
  saveUserToPersistentStore(adminUser, 'Sathish@29');

  const hrUser = await User.create({
    firstName: 'Tirumal',
    lastName: 'M',
    email: 'hr@mindmatrix.com',
    password: 'Sathish@29',
    role: 'HR_MANAGER',
    department: 'Human Resources',
    phone: '9876543211'
  });
  saveUserToPersistentStore(hrUser, 'Sathish@29');

  const recruiterUser = await User.create({
    firstName: 'Sarah',
    lastName: 'Jenkins',
    email: 'recruiter@mindmatrix.com',
    password: 'Sathish@29',
    role: 'RECRUITER',
    department: 'Talent Acquisition',
    phone: '9876543212'
  });
  saveUserToPersistentStore(recruiterUser, 'Sathish@29');

  const interviewerUser = await User.create({
    firstName: 'Alex',
    lastName: 'Rivera',
    email: 'interviewer@mindmatrix.com',
    password: 'Sathish@29',
    role: 'INTERVIEWER',
    department: 'Engineering',
    phone: '9876543213'
  });
  saveUserToPersistentStore(interviewerUser, 'Sathish@29');

  // Restoring any admin-granted team access members from persistent file storage
  console.log('Restoring admin-granted team members from persistent storage...');
  await syncPersistentUsersToDB();

  console.log('Seeding jobs...');
  const job1 = await Job.create({
    jobId: 'JOB-0001',
    title: 'Senior Frontend Developer',
    description: 'We are seeking an experienced React.js Developer to build performant, highly accessible web applications using modern UI patterns.',
    requirements: '3+ years React.js, TypeScript, Tailwind CSS, State Management, REST APIs.',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Redux', 'REST API', 'Jest'],
    experience: '3+ years',
    employmentType: 'Full-time',
    location: 'Bangalore, India',
    workMode: 'Hybrid',
    openings: 3,
    status: 'Open',
    createdBy: adminUser._id,
    assignedRecruiter: adminUser._id
  });

  const job2 = await Job.create({
    jobId: 'JOB-0002',
    title: 'Backend Systems Engineer',
    description: 'Design scalable microservices, REST APIs, and database schemas with MongoDB and Redis.',
    requirements: '4+ years Node.js, Express, MongoDB, microservices, AWS.',
    skills: ['Node.js', 'Express', 'MongoDB', 'Redis', 'Docker', 'JWT'],
    experience: '4+ years',
    employmentType: 'Full-time',
    location: 'Remote',
    workMode: 'Remote',
    openings: 2,
    status: 'Open',
    createdBy: adminUser._id,
    assignedRecruiter: adminUser._id
  });

  console.log('Seeding candidates...');
  const mockCandidates = [
    {
      candidateId: 'CAN-0001',
      fullName: 'Jane Doe',
      email: 'candidate@mindmatrix.com',
      phone: '9876543214',
      role: 'Software Engineer',
      skills: ['React', 'Node.js', 'JavaScript', 'MongoDB', 'REST APIs'],
      education: 'B.Tech in Computer Science',
      experience: '2 years',
      projects: ['Job Application Dashboard', 'E-Commerce Platform', 'AI Chat Assistant'],
      status: 'Shortlisted',
      createdBy: adminUser._id
    },
    {
      candidateId: 'CAN-0002',
      fullName: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      phone: '9812345678',
      role: 'Full Stack Engineer',
      skills: ['Java', 'Spring Boot', 'PostgreSQL', 'Microservices', 'Git'],
      education: 'B.E. in Information Technology',
      experience: 'Fresher',
      projects: ['Banking Management Portal', 'Inventory System'],
      status: 'Shortlisted',
      createdBy: adminUser._id
    },
    {
      candidateId: 'CAN-0003',
      fullName: 'Ananya Patel',
      email: 'ananya.patel@example.com',
      phone: '9823456789',
      role: 'AI Engineer',
      skills: ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning', 'NLP'],
      education: 'M.Tech in Artificial Intelligence',
      experience: 'Fresher',
      projects: ['LLM Document Classifier', 'Computer Vision Inspector'],
      status: 'Interview',
      createdBy: adminUser._id
    },
    {
      candidateId: 'CAN-0004',
      fullName: 'Vikram Sengupta',
      email: 'vikram.s@example.com',
      phone: '9834567890',
      role: 'Senior Frontend Developer',
      skills: ['React', 'TypeScript', 'Redux', 'Tailwind CSS', 'Jest'],
      education: 'B.Tech in Information Science',
      experience: '3 Years',
      projects: ['SaaS Analytics Dashboard', 'Fintech Mobile Web App'],
      status: 'Selected',
      createdBy: adminUser._id
    },
    {
      candidateId: 'CAN-0005',
      fullName: 'Neha Kulkarni',
      email: 'neha.kulkarni@example.com',
      phone: '9845678901',
      role: 'Product Manager',
      skills: ['Product Strategy', 'Agile', 'Roadmapping', 'User Research'],
      education: 'MBA in General Management',
      experience: '4 Years',
      projects: ['CRM Redesign Project', 'Mobile App Growth'],
      status: 'Shortlisted',
      createdBy: adminUser._id
    },
    {
      candidateId: 'CAN-0006',
      fullName: 'Siddharth Rao',
      email: 'siddharth.rao@example.com',
      phone: '9856789012',
      role: 'Data Scientist',
      skills: ['Python', 'SQL', 'Pandas', 'Scikit-learn', 'Tableau'],
      education: 'B.Sc in Statistics',
      experience: '2 Years',
      projects: ['Customer Churn Prediction Model', 'Sales Forecasting'],
      status: 'Interview',
      createdBy: adminUser._id
    },
    {
      candidateId: 'CAN-0007',
      fullName: 'Meera Deshmukh',
      email: 'meera.d@example.com',
      phone: '9867890123',
      role: 'UI/UX Designer',
      skills: ['Figma', 'Wireframing', 'Prototyping', 'Design Systems', 'User Testing'],
      education: 'B.CA in Computer Applications',
      experience: 'Fresher',
      projects: ['Portfolio Website', 'Weather Dashboard App'],
      status: 'Shortlisted',
      createdBy: adminUser._id
    },
    {
      candidateId: 'CAN-0008',
      fullName: 'Arjun Verma',
      email: 'arjun.verma@example.com',
      phone: '9878901234',
      role: 'DevOps Engineer',
      skills: ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'CI/CD'],
      education: 'M.S. in Cloud Computing',
      experience: '2 Years',
      projects: ['Real-time Monitoring Pipeline', 'Infrastructure Automation'],
      status: 'Selected',
      createdBy: adminUser._id
    }
  ];

  const candidates = await Candidate.insertMany(mockCandidates);

  console.log('Seeding applications...');
  for (let i = 0; i < candidates.length; i++) {
    const cand = candidates[i];
    const job = i % 2 === 0 ? job1 : job2;
    await Application.create({
      applicationId: `APP-000${i + 1}`,
      candidateId: cand._id,
      jobId: job._id,
      recruiterId: adminUser._id,
      status: cand.status,
      stage: cand.status === 'Applied' ? 'New' : cand.status,
      source: i % 3 === 0 ? 'LinkedIn' : i % 2 === 0 ? 'Website' : 'Referral',
      appliedAt: new Date(Date.now() - i * 86400000),
      stageHistory: [
        { stage: 'New', changedBy: adminUser._id, remarks: 'Application submitted' },
        ...(cand.status !== 'Applied' ? [{ stage: cand.status, changedBy: adminUser._id, remarks: `Status updated to ${cand.status}` }] : [])
      ]
    });
  }

  console.log('Seeding interviews...');
  const interviewCand = candidates.find(c => c.status === 'Interview');
  if (interviewCand) {
    await Interview.create({
      interviewId: 'INT-0001',
      candidateId: interviewCand._id,
      jobId: job1._id,
      interviewerId: adminUser._id,
      round: 'Technical Round 1',
      date: '2026-08-15',
      startTime: '10:00',
      endTime: '11:00',
      mode: 'Online',
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      notes: 'Evaluate candidate technical skill, problem solving, and architectural alignment.',
      status: 'Scheduled',
      createdBy: adminUser._id
    });

    await Notification.create({
      userId: adminUser._id,
      title: 'Interview Scheduled',
      message: `You have an interview scheduled with ${interviewCand.fullName} on 2026-08-15 at 10:00 AM.`,
      type: 'Interview Scheduled',
      link: '/interviews'
    });
  }

  console.log('Seeding audit logs...');
  await AuditLog.create({
    userId: adminUser._id,
    userName: 'Super Admin',
    action: 'SYSTEM_SEED',
    entity: 'System',
    entityId: 'SYS-001',
    description: 'Database initialized and seeded with Super Admin control account.'
  });

  console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
};

const standaloneSeed = async () => {
  try {
    const connectDB = require('../config/db');
    await connectDB();
    await runSeedLogic();
    process.exit(0);
  } catch (err) {
    console.error('Seed execution error:', err);
    process.exit(1);
  }
};

if (require.main === module) {
  standaloneSeed();
}

module.exports = { runSeedLogic };
