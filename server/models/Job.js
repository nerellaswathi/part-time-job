const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  company: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: String, required: true }, // Technology, Education, Marketing, etc.
  skills: { type: [String], default: [] },
  location: { type: String, required: true },
  workMode: { type: String, enum: ['Remote', 'On-site', 'Hybrid'], default: 'Remote' },
  jobType: { type: String, enum: ['Part-time', 'Internship', 'Freelance', 'Weekend'], default: 'Part-time' },
  salary: { type: String, required: true },
  salaryNumeric: { type: Number, default: 0 },
  workingHours: { type: String, default: '15-20 hours/week' },
  duration: { type: String, default: '3 Months' },
  requirements: { type: [String], default: [] },
  responsibilities: { type: [String], default: [] },
  applicationDeadline: { type: String, default: 'Open until filled' },
  status: { type: String, enum: ['active', 'closed'], default: 'active' },
  featured: { type: Boolean, default: false }
}, {
  timestamps: true
});

module.exports = mongoose.models.Job || mongoose.model('Job', jobSchema);
