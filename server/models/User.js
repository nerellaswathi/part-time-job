const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  degree: { type: String, default: '' },
  branch: { type: String, default: '' },
  college: { type: String, default: '' },
  graduationYear: { type: Number, default: null }
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'employer'], default: 'student' },
  phone: { type: String, default: '' },
  location: { type: String, default: '' },
  education: { type: educationSchema, default: () => ({}) },
  skills: { type: [String], default: [] },
  availability: { type: [String], default: [] }, // e.g. Weekdays, Weekends, Evenings, Morning, Flexible
  preferredJobTypes: { type: [String], default: [] }, // e.g. Part-time, Internship, Freelance, Remote, On-site, Weekend
  preferredCategories: { type: [String], default: [] }, // e.g. Technology, Education, Marketing, etc.
  expectedSalary: { type: String, default: '' },
  profileCompletion: { type: Number, default: 20 }
}, {
  timestamps: true
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
