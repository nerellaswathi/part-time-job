import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Plus,
  X,
  Check,
  Sparkles,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Info,
  Calendar,
  Briefcase
} from 'lucide-react';

const POPULAR_SKILLS = [
  'Python', 'JavaScript', 'SQL', 'React', 'MongoDB', 'MS Excel',
  'Communication', 'Git', 'Data Entry', 'SEO', 'Canva', 'HTML', 'CSS',
  'Content Writing', 'Research', 'Problem Solving'
];

const AVAILABILITY_OPTIONS = [
  'Weekdays', 'Weekends', 'Evenings', 'Morning', 'Flexible'
];

const JOB_TYPE_OPTIONS = [
  'Part-time', 'Internship', 'Freelance', 'Remote', 'On-site', 'Weekend'
];

const CATEGORY_OPTIONS = [
  'Technology', 'Education', 'Marketing', 'Data Entry',
  'Customer Support', 'Design', 'Content', 'Research'
];

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const location = useLocation();
  const justRegistered = location.state?.justRegistered;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    education: {
      degree: '',
      branch: '',
      college: '',
      graduationYear: ''
    },
    skills: [],
    availability: [],
    preferredJobTypes: [],
    preferredCategories: [],
    expectedSalary: ''
  });

  const [skillInput, setSkillInput] = useState('');
  const [completionAnalysis, setCompletionAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Load existing profile from API
  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        const res = await api.profile.get();
        if (res.success && res.user) {
          const u = res.user;
          setFormData({
            name: u.name || '',
            phone: u.phone || '',
            location: u.location || '',
            education: {
              degree: u.education?.degree || '',
              branch: u.education?.branch || '',
              college: u.education?.college || '',
              graduationYear: u.education?.graduationYear || ''
            },
            skills: u.skills || [],
            availability: u.availability || [],
            preferredJobTypes: u.preferredJobTypes || [],
            preferredCategories: u.preferredCategories || [],
            expectedSalary: u.expectedSalary || ''
          });
          setCompletionAnalysis(res.analysis);
        }
      } catch (err) {
        setErrorMessage(err.message || 'Failed to load profile.');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEducationChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      education: { ...prev.education, [field]: value }
    }));
  };

  // Skill badge management
  const addSkill = (skillToAdd) => {
    const trimmed = (skillToAdd || skillInput).trim();
    if (!trimmed) return;
    if (!formData.skills.some(s => s.toLowerCase() === trimmed.toLowerCase())) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, trimmed] }));
    }
    setSkillInput('');
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  // Multi-select toggle helpers
  const toggleSelection = (field, item) => {
    setFormData(prev => {
      const list = prev[field] || [];
      const exists = list.includes(item);
      const updated = exists ? list.filter(x => x !== item) : [...list, item];
      return { ...prev, [field]: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const res = await api.profile.update(formData);
      if (res.success) {
        updateUser(res.user);
        setCompletionAnalysis(res.analysis);
        setSuccessMessage('Profile saved successfully! AI job matching has been recalculated.');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-3" />
        <p className="text-sm text-slate-500 font-medium">Loading student profile...</p>
      </div>
    );
  }

  const completionPct = completionAnalysis?.completionPercentage || user?.profileCompletion || 30;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Welcome Banner for Fresh Registrants */}
      {justRegistered && (
        <div className="mb-8 p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-900 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-sm">Account Created! Next Step: Complete Profile</h3>
            <p className="text-xs text-indigo-700 mt-0.5 leading-relaxed">
              Add your skills (e.g., Python, JavaScript, SQL), education, and availability so our AI can match you with the best student openings.
            </p>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-full">
            Student Settings
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            Student Profile Setup
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Keep your skills and schedule up-to-date for high-precision AI job recommendations
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-200 hover:shadow-lg transition-all disabled:opacity-50 self-start sm:self-auto"
          id="btn-save-profile-top"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Profile
            </>
          )}
        </button>
      </div>

      {/* Feedback Alerts */}
      {successMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center gap-2.5 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* PROFILE COMPLETION WIDGET (Section 9 Requirement) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">Profile Completion</span>
              <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${completionPct >= 80
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-indigo-100 text-indigo-800'
                }`}>
                {completionPct}%
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Higher completion unlocks tailored AI match scoring and employer visibility
            </p>
          </div>

          <div className="text-xs text-slate-400 font-medium">
            {completionPct >= 80 ? '🌟 Profile is AI optimized' : '⚡ Complete remaining fields below'}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-4">
          <div
            className={`h-full rounded-full transition-all duration-700 ${completionPct >= 80
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                : 'bg-gradient-to-r from-indigo-500 to-purple-500'
              }`}
            style={{ width: `${completionPct}%` }}
          />
        </div>

        {/* Actionable Improvement Advice */}
        {completionAnalysis?.improvementTips && completionAnalysis.improvementTips.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-start gap-2 text-xs text-indigo-900 bg-indigo-50/60 p-3 rounded-2xl">
            <Sparkles className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">AI Tip: </span>
              <span>{completionAnalysis.improvementTips[0]}</span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* 1. Basic Information */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <User className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Basic Information</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none text-slate-800"
                id="input-profile-name"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address <span className="text-slate-400 font-normal">(Account identifier)</span>
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none text-slate-800"
                id="input-profile-phone"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Current Location (City)
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="e.g. Visakhapatnam, Bengaluru, Hyderabad"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none text-slate-800"
                id="input-profile-location"
              />
            </div>
          </div>
        </div>

        {/* 2. Education */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Education Details</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Degree
              </label>
              <input
                type="text"
                value={formData.education.degree}
                onChange={(e) => handleEducationChange('degree', e.target.value)}
                placeholder="e.g. B.Tech, BCA, B.Sc, BBA"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none text-slate-800"
                id="input-education-degree"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Branch / Specialization
              </label>
              <input
                type="text"
                value={formData.education.branch}
                onChange={(e) => handleEducationChange('branch', e.target.value)}
                placeholder="e.g. Computer Science, Information Technology"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none text-slate-800"
                id="input-education-branch"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                College / University
              </label>
              <input
                type="text"
                value={formData.education.college}
                onChange={(e) => handleEducationChange('college', e.target.value)}
                placeholder="e.g. Andhra University College of Engineering"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none text-slate-800"
                id="input-education-college"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Expected Graduation Year
              </label>
              <input
                type="number"
                value={formData.education.graduationYear || ''}
                onChange={(e) => handleEducationChange('graduationYear', e.target.value)}
                placeholder="e.g. 2026"
                min="2024"
                max="2032"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none text-slate-800"
                id="input-education-year"
              />
            </div>
          </div>
        </div>

        {/* 3. Skills (Badges + Suggestions) */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Skills (AI Core Matcher)</h2>
          </div>

          <p className="text-xs text-slate-500">
            Add skills you are proficient in or learning. AI calculates 50% of your match score directly from these skills!
          </p>

          {/* Add skill input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSkill();
                }
              }}
              placeholder="Type a skill (e.g. Python, SQL, React) and press Enter"
              className="flex-1 px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none text-slate-800"
              id="input-skill-entry"
            />
            <button
              type="button"
              onClick={() => addSkill()}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
              id="btn-add-skill"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>

          {/* Active Skills (Removable Badges) */}
          <div>
            <span className="text-xs font-semibold text-slate-700 block mb-2">
              Your Skills ({formData.skills.length}):
            </span>
            <div className="flex flex-wrap gap-2">
              {formData.skills.length === 0 ? (
                <span className="text-xs text-slate-400 italic">
                  No skills added yet. Select from suggestions below or type your own.
                </span>
              ) : (
                formData.skills.map(skill => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-indigo-200 text-indigo-800"
                      aria-label={`Remove ${skill}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Quick-Add Suggestions */}
          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-2">
              Popular Student Skills (Click to add):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_SKILLS.filter(s => !formData.skills.includes(s)).map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => addSkill(s)}
                  className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 text-slate-600 border border-slate-200 transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Availability & Working Hours */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Availability Slots</h2>
          </div>
          <p className="text-xs text-slate-500">
            Select slots when you can commit to part-time work without disrupting your academic schedule.
          </p>

          <div className="flex flex-wrap gap-2.5 pt-1">
            {AVAILABILITY_OPTIONS.map(opt => {
              const active = formData.availability.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggleSelection('availability', opt)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${active
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-200'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                >
                  {opt} {active && '✓'}
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Preferred Job Types & Work Mode */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Briefcase className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Preferred Job Types & Work Mode</h2>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {JOB_TYPE_OPTIONS.map(type => {
              const active = formData.preferredJobTypes.includes(type);
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleSelection('preferredJobTypes', type)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${active
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-200'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                >
                  {type} {active && '✓'}
                </button>
              );
            })}
          </div>
        </div>

        {/* 6. Preferred Categories & Expected Salary */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Info className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Career Interests & Expected Stipend</h2>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Preferred Categories
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_OPTIONS.map(cat => {
                const active = formData.preferredCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleSelection('preferredCategories', cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${active
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-300 font-bold'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                  >
                    {cat} {active && '✓'}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Expected Monthly Stipend <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={formData.expectedSalary}
              onChange={(e) => handleInputChange('expectedSalary', e.target.value)}
              placeholder="e.g. ₹8,000 – ₹12,000/month"
              className="w-full sm:w-1/2 px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none text-slate-800"
              id="input-expected-salary"
            />
          </div>
        </div>

        {/* Bottom Save Action */}
        <div className="pt-4 flex items-center justify-end gap-4">
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-200 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            id="btn-save-profile-bottom"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving Profile...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save & Update AI Matching
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
}
