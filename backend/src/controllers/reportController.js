const Candidate = require('../models/Candidate');
const Application = require('../models/Application');
const Job = require('../models/Job');
const Interview = require('../models/Interview');

const getDashboardMetrics = async (req, res, next) => {
  try {
    const totalCandidates = await Candidate.countDocuments();
    const shortlistedCount = await Candidate.countDocuments({ status: { $regex: /^shortlist/i } });
    const interviewCount = await Candidate.countDocuments({ status: { $regex: /^interview/i } });
    const selectedCount = await Candidate.countDocuments({ status: { $regex: /^(select|offer|hired)/i } });
    const rejectedCount = await Candidate.countDocuments({ status: { $regex: /^reject/i } });
    const appliedCount = await Candidate.countDocuments({ status: { $regex: /^(applied|new)$/i } });


    const openJobs = await Job.countDocuments({ status: 'Open' });
    const totalJobs = await Job.countDocuments();

    // Upcoming interviews
    const upcomingInterviews = await Interview.find({ status: { $in: ['Scheduled', 'Confirmed'] } })
      .populate('candidateId', 'fullName email role')
      .populate('interviewerId', 'firstName lastName email')
      .sort({ date: 1, startTime: 1 })
      .limit(5);

    // Status distribution breakdown
    const distribution = [
      { name: 'New', count: appliedCount, color: '#8b5cf6' },
      { name: 'Shortlisted', count: shortlistedCount, color: '#3b82f6' },
      { name: 'Interview', count: interviewCount, color: '#f59e0b' },
      { name: 'Selected', count: selectedCount, color: '#10b981' },
      { name: 'Rejected', count: rejectedCount, color: '#ef4444' }
    ];

    res.status(200).json({
      success: true,
      data: {
        metrics: {
          totalCandidates,
          shortlistedCount,
          interviewCount,
          selectedCount,
          rejectedCount,
          appliedCount,
          openJobs,
          totalJobs
        },
        distribution,
        upcomingInterviews
      }
    });
  } catch (error) {
    next(error);
  }
};

const exportReportsCSV = async (req, res, next) => {
  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 });

    let csvContent = 'Candidate ID,Full Name,Email,Phone,Role,Status,Experience,Created At\n';
    candidates.forEach(c => {
      csvContent += `"${c.candidateId}","${c.fullName}","${c.email}","${c.phone}","${c.role}","${c.status}","${c.experience}","${c.createdAt.toISOString()}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=recruitment_report.csv');
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardMetrics,
  exportReportsCSV
};
