const { getModel } = require('../services/db');
const { calculateMatch } = require('../services/aiService');

// Get jobs with rich search, filters, AI scoring and sorting
exports.getJobs = async (req, res) => {
  try {
    const {
      q,
      jobType,
      category,
      workMode,
      location,
      minSalary,
      skill,
      sort = 'newest'
    } = req.query;

    const Job = getModel('Job');
    let jobs = await Job.find();
    jobs = jobs.filter(j => !j.status || j.status === 'active');

    // Text search across title, company, skills, category, location
    if (q && q.trim()) {
      const term = q.trim().toLowerCase();
      jobs = jobs.filter(job => {
        const title = (job.title || '').toLowerCase();
        const company = (job.company || '').toLowerCase();
        const cat = (job.category || '').toLowerCase();
        const loc = (job.location || '').toLowerCase();
        const skills = (job.skills || []).map(s => s.toLowerCase()).join(' ');
        return title.includes(term) || company.includes(term) || cat.includes(term) || loc.includes(term) || skills.includes(term);
      });
    }

    // Filter by Job Type
    if (jobType && jobType !== 'All') {
      jobs = jobs.filter(j => j.jobType.toLowerCase() === jobType.toLowerCase());
    }

    // Filter by Category
    if (category && category !== 'All') {
      jobs = jobs.filter(j => j.category.toLowerCase() === category.toLowerCase());
    }

    // Filter by Work Mode
    if (workMode && workMode !== 'All') {
      jobs = jobs.filter(j => j.workMode.toLowerCase() === workMode.toLowerCase());
    }

    // Filter by Location
    if (location && location !== 'All') {
      const locTerm = location.toLowerCase();
      jobs = jobs.filter(j => (j.location || '').toLowerCase().includes(locTerm));
    }

    // Filter by specific skill
    if (skill) {
      const skillTerm = skill.toLowerCase();
      jobs = jobs.filter(j => (j.skills || []).some(s => s.toLowerCase().includes(skillTerm)));
    }

    // Attach AI match score and already-applied flag if student is authenticated
    const student = req.user || null;
    let appliedJobIds = new Set();

    if (student) {
      const Application = getModel('Application');
      const studentApps = await Application.find({ studentId: student._id });
      appliedJobIds = new Set(studentApps.map(a => String(a.jobId)));
    }

    const enhancedJobs = jobs.map(job => {
      const match = student ? calculateMatch(student, job) : { score: 75, reasons: ['Log in to see your personalized AI match score!'], matchedSkills: [], missingSkills: [] };
      return {
        ...job,
        aiMatchScore: match.score,
        aiReasons: match.reasons,
        matchedSkills: match.matchedSkills,
        missingSkills: match.missingSkills,
        alreadyApplied: appliedJobIds.has(String(job._id))
      };
    });

    // Sorting
    if (sort === 'ai_match') {
      enhancedJobs.sort((a, b) => b.aiMatchScore - a.aiMatchScore);
    } else if (sort === 'salary_desc') {
      enhancedJobs.sort((a, b) => (b.salaryNumeric || 0) - (a.salaryNumeric || 0));
    } else if (sort === 'salary_asc') {
      enhancedJobs.sort((a, b) => (a.salaryNumeric || 0) - (b.salaryNumeric || 0));
    } else {
      // Newest first
      enhancedJobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    res.status(200).json({
      success: true,
      count: enhancedJobs.length,
      jobs: enhancedJobs
    });
  } catch (error) {
    console.error('[Get Jobs Error]:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve jobs.' });
  }
};

// Get single job details with full AI analysis
exports.getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const Job = getModel('Job');
    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job posting not found.' });
    }

    const student = req.user || null;
    let match = {
      score: 75,
      breakdown: { skill: 35, location: 15, availability: 15, jobType: 10, education: 0 },
      matchedSkills: [],
      missingSkills: job.skills || [],
      reasons: ['Sign in and complete your profile to unlock custom AI compatibility insights.']
    };

    let existingApplication = null;
    if (student) {
      match = calculateMatch(student, job);
      const Application = getModel('Application');
      const apps = await Application.find({ studentId: student._id });
      existingApplication = apps.find(a => String(a.jobId) === String(job._id)) || null;
    }

    res.status(200).json({
      success: true,
      job: {
        ...job,
        aiMatch: match,
        alreadyApplied: !!existingApplication,
        applicationStatus: existingApplication ? existingApplication.status : null,
        appliedDate: existingApplication ? existingApplication.appliedAt : null
      }
    });
  } catch (error) {
    console.error('[Get Job By Id Error]:', error);
    res.status(500).json({ success: false, message: 'Could not fetch job details.' });
  }
};
