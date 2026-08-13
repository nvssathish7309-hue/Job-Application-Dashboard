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

  console.log('Seeding demo users...');
  const adminUser = await User.create({
    firstName: 'Super',
    lastName: 'Admin',
    email: 'admin@mindmatrix.com',
    password: 'Sathish@29',
    role: 'SUPER_ADMIN',
    department: 'Executive',
    phone: '+1 800-555-0199'
  });

  const hrUser = await User.create({
    firstName: 'Sarah',
    lastName: 'Jenkins',
    email: 'hr@mindmatrix.com',
    password: 'Sathish@29',
    role: 'HR_MANAGER',
    department: 'Human Resources',
    phone: '+1 800-555-0122'
  });

  const recruiterUser = await User.create({
    firstName: 'Alex',
    lastName: 'Rivera',
    email: 'recruiter@mindmatrix.com',
    password: 'Sathish@29',
    role: 'RECRUITER',
    department: 'Talent Acquisition',
    phone: '+1 800-555-0144'
  });

  const interviewerUser = await User.create({
    firstName: 'David',
    lastName: 'Chen',
    email: 'interviewer@mindmatrix.com',
    password: 'Sathish@29',
    role: 'INTERVIEWER',
    department: 'Engineering',
    phone: '+1 800-555-0166'
  });

  const candidateUser1 = await User.create({
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'candidate@mindmatrix.com',
    password: 'Password123!',
    role: 'CANDIDATE',
    department: 'Applicant Portal',
    phone: '+1 800-555-0188'
  });

  console.log('Seeding jobs...');
  const job1 = await Job.create({
    jobId: 'JOB-0001',
    title: 'Senior Frontend Engineer',
    department: 'Engineering',
    description: 'Lead frontend development using React, TypeScript, and Tailwind CSS to build high performance recruitment tools.',
    requirements: '5+ years React experience, CSS architecture, web performance optimization.',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'REST APIs'],
    experience: '5+ years',
    employmentType: 'Full-time',
    location: 'Bangalore, India',
    workMode: 'Hybrid',
    openings: 3,
    status: 'Open',
    createdBy: hrUser._id,
    assignedRecruiter: recruiterUser._id
  });

  const job2 = await Job.create({
    jobId: 'JOB-0002',
    title: 'Backend Node.js Architect',
    department: 'Engineering',
    description: 'Design scalable microservices, REST APIs, and database schemas with MongoDB and Redis.',
    requirements: '4+ years Node.js, Express, MongoDB, microservices, AWS.',
    skills: ['Node.js', 'Express', 'MongoDB', 'Redis', 'Docker', 'JWT'],
    experience: '4+ years',
    employmentType: 'Full-time',
    location: 'Remote',
    workMode: 'Remote',
    openings: 2,
    status: 'Open',
    createdBy: hrUser._id,
    assignedRecruiter: recruiterUser._id
  });

  console.log('Seeding candidates...');
  const mockCandidates = [
    {
      candidateId: 'CAN-0001',
      fullName: 'Jane Doe',
      email: 'candidate@mindmatrix.com',
      phone: '+1 800-555-0188',
      role: 'Software Engineer',
      skills: ['React', 'Node.js', 'JavaScript', 'MongoDB', 'HTML5', 'CSS3'],
      education: 'B.Tech in Computer Science',
      experience: '2 years',
      projects: ['Job Application Dashboard', 'E-Commerce Platform', 'AI Chat Assistant'],
      status: 'Shortlisted',
      createdBy: recruiterUser._id
    },
    {
      candidateId: 'CAN-0002',
      fullName: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      phone: '+91 9812345678',
      role: 'Software Engineer',
      skills: ['Java', 'Spring Boot', 'SQL', 'Microservices', 'Git'],
      education: 'B.E. Information Technology',
      experience: 'Fresher',
      projects: ['Banking Management Portal', 'Inventory System'],
      status: 'Shortlisted',
      createdBy: recruiterUser._id
    },
    {
      candidateId: 'CAN-0003',
      fullName: 'Ananya Patel',
      email: 'ananya.patel@example.com',
      phone: '+91 9823456789',
      role: 'AI Engineer',
      skills: ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning', 'NLP'],
      education: 'M.Tech in Artificial Intelligence',
      experience: 'Fresher',
      projects: ['LLM Document Classifier', 'Computer Vision Inspector'],
      status: 'Interview',
      createdBy: recruiterUser._id
    },
    {
      candidateId: 'CAN-0004',
      fullName: 'Vikram Sengupta',
      email: 'vikram.s@example.com',
      phone: '+91 9834567890',
      role: 'Software Engineer',
      skills: ['React', 'TypeScript', 'Redux', 'Tailwind CSS', 'Jest'],
      education: 'B.Tech Computer Science',
      experience: '3 Years',
      projects: ['SaaS Analytics Dashboard', 'Fintech Mobile Web App'],
      status: 'Selected',
      createdBy: recruiterUser._id
    },
    {
      candidateId: 'CAN-0005',
      fullName: 'Neha Kulkarni',
      email: 'neha.kulkarni@example.com',
      phone: '+91 9845678901',
      role: 'Product Manager',
      skills: ['Product Strategy', 'Agile', 'Roadmapping', 'User Research'],
      education: 'MBA in General Management',
      experience: '4 Years',
      projects: ['CRM Redesign Project', 'Mobile App Growth'],
      status: 'Shortlisted',
      createdBy: recruiterUser._id
    },
    {
      candidateId: 'CAN-0006',
      fullName: 'Siddharth Rao',
      email: 'siddharth.rao@example.com',
      phone: '+91 9856789012',
      role: 'Data Scientist',
      skills: ['Python', 'SQL', 'Pandas', 'Scikit-learn', 'Tableau'],
      education: 'B.Sc Statistics',
      experience: '2 Years',
      projects: ['Customer Churn Prediction Model', 'Sales Forecasting'],
      status: 'Interview',
      createdBy: recruiterUser._id
    },
    {
      candidateId: 'CAN-0007',
      fullName: 'Meera Deshmukh',
      email: 'meera.d@example.com',
      phone: '+91 9867890123',
      role: 'Frontend Developer',
      skills: ['HTML5', 'CSS3', 'JavaScript', 'Vue.js', 'Tailwind'],
      education: 'B.CA',
      experience: 'Fresher',
      projects: ['Portfolio Website', 'Weather Dashboard App'],
      status: 'Shortlisted',
      createdBy: recruiterUser._id
    },
    {
      candidateId: 'CAN-0008',
      fullName: 'Arjun Verma',
      email: 'arjun.verma@example.com',
      phone: '+91 9878901234',
      role: 'AI Engineer',
      skills: ['Python', 'PyTorch', 'FastAPI', 'Docker', 'OpenCV'],
      education: 'M.S. Data Science',
      experience: '2 Years',
      projects: ['Real-time Face Recognition System', 'Recommendation Engine'],
      status: 'Selected',
      createdBy: recruiterUser._id
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
      recruiterId: recruiterUser._id,
      status: cand.status,
      stage: cand.status === 'Applied' ? 'New' : cand.status,
      source: i % 3 === 0 ? 'LinkedIn' : i % 2 === 0 ? 'Website' : 'Referral',
      appliedAt: new Date(Date.now() - i * 86400000),
      stageHistory: [
        { stage: 'New', changedBy: recruiterUser._id, remarks: 'Application submitted' },
        ...(cand.status !== 'Applied' ? [{ stage: cand.status, changedBy: hrUser._id, remarks: `Status updated to ${cand.status}` }] : [])
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
      interviewerId: interviewerUser._id,
      round: 'Technical Round 1',
      date: '2026-08-15',
      startTime: '10:00',
      endTime: '11:00',
      mode: 'Online',
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      notes: 'Evaluate React component design, state management, and algorithm problem solving.',
      status: 'Scheduled',
      createdBy: recruiterUser._id
    });

    await Notification.create({
      userId: interviewerUser._id,
      title: 'Interview Scheduled',
      message: `You have an interview scheduled with ${interviewCand.fullName} on 2026-08-15 at 10:00 AM.`,
      type: 'Interview Scheduled',
      link: '/interviews'
    });
  }

  console.log('Seeding audit logs...');
  await AuditLog.create({
    userId: hrUser._id,
    userName: 'Sarah Jenkins',
    action: 'SYSTEM_SEED',
    entity: 'System',
    entityId: 'SYS-001',
    description: 'Database initialized and seeded with full-stack demo data.'
  });

  console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
};

const standaloneSeed = async () => {
  try {
    const connectDB = require('../config/db');
    await connectDB();
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
