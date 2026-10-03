import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  X,
  Sparkles,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Building2,
  GraduationCap,
  RefreshCw
} from 'lucide-react';

export default function ApplyModal({ job, isOpen, onClose, onSuccess }) {
  const { user } = useAuth();
  const [coverMessage, setCoverMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !job) return null;

  // Handle AI generation of personalized cover message
  const handleGenerateAI = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const res = await api.ai.generateCoverMessage(job._id);
      if (res.success && res.message) {
        setCoverMessage(res.message);
      }
    } catch (err) {
      setError(err.message || 'Failed to generate AI application message.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await api.applications.apply(job._id, coverMessage);
      if (res.success) {
        onSuccess(res.application);
      }
    } catch (err) {
      setError(err.message || 'Application submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all scale-100"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50/50 via-white to-purple-50/30">
          <div>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Student Application
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-1">
              Apply for {job.title}
            </h3>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              {job.company} • {job.location} ({job.workMode})
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Student Profile Preview */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Applicant Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block">Student Name</span>
                <span className="font-semibold text-slate-800">{user?.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Email Address</span>
                <span className="font-semibold text-slate-800">{user?.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Education</span>
                <span className="font-semibold text-slate-800">
                  {user?.education?.degree ? `${user.education.degree} (${user.education.college || 'Enrolled'})` : 'Student'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Availability</span>
                <span className="font-semibold text-slate-800">
                  {(user?.availability || []).join(', ') || 'Flexible'}
                </span>
              </div>
            </div>

            {/* Skills */}
            <div>
              <span className="text-slate-400 text-xs block mb-1.5">Your Skills:</span>
              <div className="flex flex-wrap gap-1.5">
                {(user?.skills || []).length > 0 ? (
                  user.skills.map((s, idx) => (
                    <span key={idx} className="text-xs font-medium bg-white text-indigo-700 px-2 py-0.5 rounded-md border border-slate-200">
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">No skills listed yet (You can add them in Profile).</span>
                )}
              </div>
            </div>
          </div>

          {/* Application Cover Message with AI Generator */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-slate-800">
                Why are you interested in this job?
              </label>

              {/* Generate with AI Button */}
              <button
                type="button"
                onClick={handleGenerateAI}
                disabled={isGenerating}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-all hover:shadow-sm disabled:opacity-50"
                id="btn-generate-ai"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Generating with AI...
                  </>
                ) : coverMessage ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5" />
                    Regenerate with AI
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    Generate with AI
                  </>
                )}
              </button>
            </div>

            <textarea
              rows={6}
              value={coverMessage}
              onChange={(e) => setCoverMessage(e.target.value)}
              placeholder="Tell the employer why you're a good fit, or click 'Generate with AI' to draft a personalized letter based on your profile..."
              className="w-full text-xs sm:text-sm p-3.5 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all resize-y leading-relaxed text-slate-800"
              id="input-cover-message"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              You can freely edit or customize the text before submitting.
            </p>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-200 hover:shadow-lg transition-all disabled:opacity-50"
              id="btn-submit-application"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting Application...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Application
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
