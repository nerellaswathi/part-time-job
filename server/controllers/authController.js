const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getModel } = require('../services/db');
const { analyzeProfile } = require('../services/aiService');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_job_platform_2026_dev';

function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, phone } = req.body;

    // Validations
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields (name, email, password).' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    const User = getModel('User');
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const initialData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      phone: phone ? phone.trim() : '',
      role: 'student',
      skills: [],
      availability: [],
      preferredJobTypes: ['Part-time', 'Internship', 'Remote'],
      preferredCategories: ['Technology'],
      education: { degree: '', branch: '', college: '', graduationYear: null },
      location: '',
      expectedSalary: '',
      profileCompletion: 25
    };

    const analysis = analyzeProfile(initialData);
    initialData.profileCompletion = analysis.completionPercentage;

    const newUser = await User.create(initialData);

    // Create a welcoming notification
    const Notification = getModel('Notification');
    await Notification.create({
      userId: newUser._id,
      title: 'Welcome to TalentAI! 🚀',
      message: 'Your student account has been created. Set up your skills and preferences to unlock high-accuracy AI job matching.',
      type: 'profile_reminder'
    });

    const token = generateToken(newUser);
    const userSafe = newUser.toObject();
    delete userSafe.password;

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome aboard.',
      token,
      user: userSafe
    });
  } catch (error) {
    console.error('[Register Error]:', error);
    res.status(500).json({ success: false, message: 'Registration failed due to server error. Please try again.' });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
    }

    const User = getModel('User');
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken(user);
    const userSafe = user.toObject();
    delete userSafe.password;

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: userSafe
    });
  } catch (error) {
    console.error('[Login Error]:', error);
    res.status(500).json({ success: false, message: 'Login failed due to server error.' });
  }
};

// Get current user profile
exports.getMe = async (req, res) => {
  try {
    const user = req.user;
    const userSafe = { ...user };
    delete userSafe.password;
    res.status(200).json({ success: true, user: userSafe });
  } catch (error) {
    console.error('[GetMe Error]:', error);
    res.status(500).json({ success: false, message: 'Could not fetch user profile.' });
  }
};
