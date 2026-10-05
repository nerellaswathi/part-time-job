const { getModel } = require('../services/db');
const { calculateMatch } = require('../services/aiService');

// Submit job application with duplicate prevention
exports.applyForJob = async (req, res) => {
  try {
    const { jobId, coverMessage } = req.body;
    const student = req.user;

    if (!jobId) {
      return res.status(400).json({ success: false, message: 'Job ID is required.' });
    }

    const Job = getModel('Job');
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    const Application = getModel('Application');
    // Duplicate prevention check
    const existing = await Application.findOne({ studentId: student._id, jobId: job._id });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted an application for this job.',
        application: existing
      });
    }

    // Compute AI match score at time of application
    const match = calculateMatch(student, job);

    const newApp = await Application.create({
      studentId: student._id,
      jobId: job._id,
      coverMessage: (coverMessage || '').trim(),
      matchScore: match.score,
      status: 'Applied',
      statusTimeline: [
        {
          status: 'Applied',
          date: new Date(),
          note: 'Application submitted successfully by student.'
        }
      ],
      appliedAt: new Date()
    });

    // Create confirmation notification
    const Notification = getModel('Notification');
    await Notification.create({
      userId: student._id,
      title: 'Application Submitted ✅',
      message: `Your application for "${job.title}" at ${job.company} has been received. Current status: Applied.`,
      type: 'application_submitted',
      link: '/applications'
    });

    const appObj = newApp.toObject ? newApp.toObject() : newApp;
    const jobObj = job.toObject ? job.toObject() : job;

    res.status(201).json({
      success: true,
      message: `Application submitted successfully for ${job.title}!`,
      application: {
        ...appObj,
        job: jobObj
      }
    });
  } catch (error) {
    console.error('[Apply Error]:', error);
    res.status(500).json({ success: false, message: 'Failed to submit application.' });
  }
};

// Get all applications for current student with populated job details
exports.getMyApplications = async (req, res) => {
  try {
    const studentId = req.user._id;
    const Application = getModel('Application');
    const Job = getModel('Job');

    const applications = await Application.find({ studentId });

    // Populate job details
    const populated = await Promise.all(applications.map(async (app) => {
      const job = await Job.findById(app.jobId);
      const appObj = app.toObject ? app.toObject() : app;
      const jobObj = job ? (job.toObject ? job.toObject() : job) : {
        title: 'Position (Archive)',
        company: 'Partner Enterprise',
        location: 'Remote',
        workMode: 'Remote',
        salary: '₹10,000/month',
        jobType: 'Part-time'
      };
      return { ...appObj, job: jobObj };
    }));

    // Sort by latest applied
    populated.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));

    res.status(200).json({
      success: true,
      count: populated.length,
      applications: populated
    });
  } catch (error) {
    console.error('[Get My Applications Error]:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve applications.' });
  }
};

// Get single application details
exports.getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const Application = getModel('Application');
    const Job = getModel('Job');

    const app = await Application.findById(id);
    if (!app) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    if (String(app.studentId) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Unauthorized access to this application.' });
    }

    const job = await Job.findById(app.jobId);

    const appObj = app.toObject ? app.toObject() : app;
    const jobObj = job ? (job.toObject ? job.toObject() : job) : null;

    res.status(200).json({
      success: true,
      application: { ...appObj, job: jobObj }
    });
  } catch (error) {
    console.error('[Get Application By Id Error]:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch application.' });
  }
};

// Simulation endpoint: Allows advancing application status to demonstrate the timeline!
exports.simulateStatusAdvance = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'Under Review' | 'Shortlisted' | 'Interview' | 'Selected' | 'Rejected'

    const validStatuses = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status provided.' });
    }

    const Application = getModel('Application');
    const app = await Application.findById(id);
    if (!app) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    const Job = getModel('Job');
    const job = await Job.findById(app.jobId);

    const timeline = app.statusTimeline || [];
    timeline.push({
      status,
      date: new Date(),
      note: `Application transitioned to ${status}.`
    });

    const updated = await Application.findByIdAndUpdate(id, {
      status,
      statusTimeline: timeline
    }, { new: true });

    // Send notification
    const Notification = getModel('Notification');
    await Notification.create({
      userId: app.studentId,
      title: `Application Update: ${status} 🔔`,
      message: `Your application for "${job ? job.title : 'Job'}" has been updated to "${status}".`,
      type: 'status_update',
      link: '/applications'
    });

    const updatedObj = updated.toObject ? updated.toObject() : updated;

    res.status(200).json({
      success: true,
      message: `Status updated to ${status}`,
      application: updatedObj
    });
  } catch (error) {
    console.error('[Simulate Status Advance Error]:', error);
    res.status(500).json({ success: false, message: 'Could not update status.' });
  }
};
