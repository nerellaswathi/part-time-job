const { getModel } = require('../services/db');
const { calculateMatch, generateApplicationMessage, analyzeProfile } = require('../services/aiService');

// Calculate match between current student and a given job
exports.getJobMatch = async (req, res) => {
  try {
    const { jobId } = req.body;
    const student = req.user;

    const Job = getModel('Job');
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    const matchResult = calculateMatch(student, job);
    res.status(200).json({
      success: true,
      match: matchResult
    });
  } catch (error) {
    console.error('[AI Match Error]:', error);
    res.status(500).json({ success: false, message: 'Failed to calculate AI match.' });
  }
};

// Get top AI recommended jobs ranked by compatibility
exports.getRecommendations = async (req, res) => {
  try {
    const student = req.user;
    const Job = getModel('Job');
    const Application = getModel('Application');

    // Fetch all jobs - handle both MongoDB (has status field) and file-store fallback (no status field)
    const allJobsRaw = await Job.find({});
    const allJobs = allJobsRaw.filter(j => !j.status || j.status === 'active');
    const studentApps = await Application.find({ studentId: student._id });
    const appliedSet = new Set(studentApps.map(a => String(a.jobId)));

    const scoredJobs = allJobs.map(job => {
      const match = calculateMatch(student, job);
      return {
        ...job,
        aiMatchScore: match.score,
        aiReasons: match.reasons,
        breakdown: match.breakdown,
        matchedSkills: match.matchedSkills,
        missingSkills: match.missingSkills,
        alreadyApplied: appliedSet.has(String(job._id))
      };
    });

    // Sort by compatibility descending
    scoredJobs.sort((a, b) => b.aiMatchScore - a.aiMatchScore);

    // Pick top 6 recommended jobs
    const topRecommendations = scoredJobs.slice(0, 6);

    res.status(200).json({
      success: true,
      recommendations: topRecommendations,
      totalEvaluated: allJobs.length
    });
  } catch (error) {
    console.error('[AI Recommendations Error]:', error);
    res.status(500).json({ success: false, message: 'Could not generate recommendations.' });
  }
};

// Generate AI application cover message
exports.generateApplicationMessage = async (req, res) => {
  try {
    const { jobId } = req.body;
    const student = req.user;

    const Job = getModel('Job');
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    const message = await generateApplicationMessage(student, job);

    res.status(200).json({
      success: true,
      message
    });
  } catch (error) {
    console.error('[AI App Message Error]:', error);
    res.status(500).json({ success: false, message: 'Failed to generate application message.' });
  }
};

// Get AI profile analysis & completion suggestions
exports.getProfileAnalysis = async (req, res) => {
  try {
    const student = req.user;
    const analysis = analyzeProfile(student);

    res.status(200).json({
      success: true,
      analysis
    });
  } catch (error) {
    console.error('[AI Profile Analysis Error]:', error);
    res.status(500).json({ success: false, message: 'Profile analysis failed.' });
  }
};
