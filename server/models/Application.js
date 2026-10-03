const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  coverMessage: { type: String, default: '' },
  matchScore: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected'],
    default: 'Applied'
  },
  statusTimeline: [
    {
      status: { type: String, required: true },
      date: { type: Date, default: Date.now },
      note: { type: String, default: '' }
    }
  ],
  appliedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

module.exports = mongoose.models.Application || mongoose.model('Application', applicationSchema);
