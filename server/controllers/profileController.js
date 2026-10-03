const { getModel } = require('../services/db');
const { analyzeProfile } = require('../services/aiService');

// Get profile with AI completion metrics
exports.getProfile = async (req, res) => {
  try {
    const User = getModel('User');
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const analysis = analyzeProfile(user);
    const userSafe = { ...user };
    delete userSafe.password;

    res.status(200).json({
      success: true,
      user: userSafe,
      analysis
    });
  } catch (error) {
    console.error('[Get Profile Error]:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve profile.' });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const User = getModel('User');
    const {
      name,
      phone,
      location,
      education,
      skills,
      availability,
      preferredJobTypes,
      preferredCategories,
      expectedSalary
    } = req.body;

    const updates = {};
    if (name !== undefined) updates.name = name.trim();
    if (phone !== undefined) updates.phone = phone.trim();
    if (location !== undefined) updates.location = location.trim();
    if (expectedSalary !== undefined) updates.expectedSalary = expectedSalary.trim();

    if (education !== undefined) {
      updates.education = {
        degree: education.degree ? education.degree.trim() : '',
        branch: education.branch ? education.branch.trim() : '',
        college: education.college ? education.college.trim() : '',
        graduationYear: education.graduationYear ? Number(education.graduationYear) : null
      };
    }

    if (Array.isArray(skills)) {
      // Normalize unique skills
      updates.skills = [...new Set(skills.map(s => (s || '').trim()).filter(Boolean))];
    }

    if (Array.isArray(availability)) {
      updates.availability = [...new Set(availability.map(a => (a || '').trim()).filter(Boolean))];
    }

    if (Array.isArray(preferredJobTypes)) {
      updates.preferredJobTypes = [...new Set(preferredJobTypes.map(t => (t || '').trim()).filter(Boolean))];
    }

    if (Array.isArray(preferredCategories)) {
      updates.preferredCategories = [...new Set(preferredCategories.map(c => (c || '').trim()).filter(Boolean))];
    }

    // Merge current state with updates to calculate new completion score
    const merged = { ...req.user, ...updates };
    const analysis = analyzeProfile(merged);
    updates.profileCompletion = analysis.completionPercentage;

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, { new: true });

    // Notification if user crossed 80% completion
    if (analysis.completionPercentage >= 80 && (req.user.profileCompletion || 0) < 80) {
      const Notification = getModel('Notification');
      await Notification.create({
        userId: req.user._id,
        title: 'Profile Milestone Reached! 🌟',
        message: `Great job! Your profile is now ${analysis.completionPercentage}% complete. AI job matching accuracy is at peak efficiency.`,
        type: 'ai_recommendation'
      });
    }

    const userSafe = { ...updatedUser };
    delete userSafe.password;

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: userSafe,
      analysis
    });
  } catch (error) {
    console.error('[Update Profile Error]:', error);
    res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
};
