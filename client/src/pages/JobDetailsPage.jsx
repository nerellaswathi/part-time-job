import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import MatchBadge from '../components/common/MatchBadge';
import ApplyModal from '../components/jobs/ApplyModal';
import {
  Building2,
  MapPin,
  IndianRupee,
  Clock,
  Calendar,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Send,
  Loader2,
  Check,
  Share2,
  FileText
} from 'lucide-react';

export default function JobDetailsPage() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applySuccessBanner, setApplySuccessBanner] = useState(false);

  useEffect(() => {
    async function loadJobDetails() {
      try {
        setLoading(true);
        const res = await api.jobs.getById(id);
        if (res.success && res.job) {
          setJob(res.job);
        } else {
          setError('Job not found.');
        }
      } catch (err) {
        setError(err.message || 'Failed to retrieve job details.');
      } finally {
        setLoading(false);
      }
    }
    loadJobDetails();
  }, [id]);

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/jobs/${id}` } } });
      return;
    }
    setIsApplyModalOpen(true);
  };

  const handleApplySuccess = (application) => {
    setIsApplyModalOpen(false);
    setApplySuccessBanner(true);
    setJob(prev => ({
      ...prev,
      alreadyApplied: true,
      applicationStatus: application.status || 'Applied',
      appliedDate: application.appliedAt
    }));
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-3" />
        <p className="text-sm font-medium text-slate-500">Loading job details & AI matching...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-2xl font-bold text-slate-900">Job Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">{error || 'This job posting may have expired or been removed.'}</p>
        <Link to="/jobs" className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold">
          <ArrowLeft className="w-4 h-4" />
          Back to Jobs
        </Link>
      </div>
    );
  }

  const aiMatch = job.aiMatch || { score: 75, breakdown: {}, matchedSkills: [], missingSkills: [], reasons: [] };
  const score = aiMatch.score || 75;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      {/* Back button */}
      <div>
        <Link
          to="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Browse Jobs
        </Link>
      </div>

      {/* Applied Confirmation Banner */}
      {applySuccessBanner && (
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start justify-between gap-3 animate-in fade-in">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm">Application Submitted Successfully! 🎉</h4>
              <p className="text-xs text-emerald-800 mt-0.5">
                Your application for {job.title} has been logged. You can track its live timeline in My Applications.
              </p>
            </div>
          </div>
          <Link
            to="/applications"
            className="text-xs font-bold text-emerald-700 bg-white px-3 py-1.5 rounded-lg border border-emerald-300 hover:bg-emerald-100 transition-colors flex-shrink-0"
          >
            Track Status &rarr;
          </Link>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider">
                {job.category}
              </span>
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                {job.jobType}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              {job.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-600 pt-1">
              <div className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-slate-400" />
                <span className="font-semibold text-slate-800">{job.company}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>{job.location} ({job.workMode})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <IndianRupee className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-emerald-700">{job.salary}</span>
              </div>
            </div>
          </div>

          {/* Action CTA Box */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end gap-3 flex-shrink-0">
            {job.alreadyApplied ? (
              <div className="flex flex-col items-center lg:items-end gap-1.5">
                <button
                  disabled
                  className="w-full sm:w-auto px-6 py-3 bg-slate-100 text-slate-500 font-bold text-sm rounded-xl border border-slate-300 cursor-not-allowed flex items-center justify-center gap-2"
                  id="btn-already-applied"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Already Applied
                </button>
                <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                  Status: {job.applicationStatus || 'Applied'}
                </span>
              </div>
            ) : (
              <button
                onClick={handleApplyClick}
                className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all flex items-center justify-center gap-2"
                id="btn-apply-now"
              >
                <Send className="w-4 h-4" />
                Apply Now
              </button>
            )}

            <div className="text-center lg:text-right text-[11px] text-slate-400">
              Deadline: {job.applicationDeadline || 'Open until filled'}
            </div>
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-2xl">
            <span className="text-slate-400 block mb-0.5">Work Mode</span>
            <span className="font-bold text-slate-800">{job.workMode}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl">
            <span className="text-slate-400 block mb-0.5">Working Hours</span>
            <span className="font-bold text-slate-800">{job.workingHours || '15-20 hrs/week'}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl">
            <span className="text-slate-400 block mb-0.5">Engagement Duration</span>
            <span className="font-bold text-slate-800">{job.duration || '3 Months'}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl">
            <span className="text-slate-400 block mb-0.5">Application Deadline</span>
            <span className="font-bold text-slate-800">{job.applicationDeadline}</span>
          </div>
        </div>
      </div>

      {/* AI MATCH SECTION (Section 13 & 15 Requirement) */}
      <div className="bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/50 p-6 sm:p-8 rounded-3xl border border-indigo-200 shadow-sm space-y-6">

        {/* Large Visual AI Match Score */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-indigo-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-indigo-600 text-white flex flex-col items-center justify-center shadow-lg shadow-indigo-200">
              <span className="text-xl sm:text-2xl font-black">{score}%</span>
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-90">AI Match</span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <h3 className="text-lg font-bold text-slate-900">
                  AI Compatibility Score
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 max-w-md">
                Evaluated against your profile skills, remote preference, schedule availability, and university education.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <MatchBadge score={score} size="lg" />
          </div>
        </div>

        {/* Why You Match (Section 13 Requirement) */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-950 mb-3 flex items-center gap-2">
            <span>Why you match</span>
          </h4>
          <div className="space-y-2.5">
            {(aiMatch.reasons || []).map((reason, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 bg-white p-3 rounded-xl border border-indigo-100">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Gap Analysis (Section 13 Requirement) */}
        <div className="pt-4 border-t border-indigo-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-950 mb-3">
            Skill Gap Breakdown
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Matched skills */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90">
              <span className="text-xs font-bold text-emerald-700 block mb-2">
                You have (✓ Matching):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(aiMatch.matchedSkills || []).length > 0 ? (
                  aiMatch.matchedSkills.map((s, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                      ✓ {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">No direct skill matches found in profile.</span>
                )}
              </div>
            </div>

            {/* Missing skills */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90">
              <span className="text-xs font-bold text-amber-700 block mb-2">
                Missing (○ Learnable for this role):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(aiMatch.missingSkills || []).length > 0 ? (
                  aiMatch.missingSkills.map((s, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                      ○ {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-emerald-600 font-semibold">
                    100% skill requirements covered! 🎯
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* JOB DESCRIPTION, RESPONSIBILITIES, REQUIREMENTS */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-8">

        {/* About Job */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-3">About the Job</h2>
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
            {job.description}
          </p>
        </div>

        {/* Required Skills */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-3">Required Skills</h2>
          <div className="flex flex-wrap gap-2">
            {(job.skills || []).map((skill, idx) => (
              <span
                key={idx}
                className="text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 border border-slate-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Key Responsibilities */}
        {job.responsibilities && job.responsibilities.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-3">Responsibilities</h2>
            <ul className="space-y-2.5 text-sm text-slate-600">
              {job.responsibilities.map((r, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 flex-shrink-0 mt-2" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Requirements */}
        {job.requirements && job.requirements.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-3">Requirements & Qualifications</h2>
            <ul className="space-y-2.5 text-sm text-slate-600">
              {job.requirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 flex-shrink-0 mt-2" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Bottom Apply Action */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-400 block">Stipend Offered</span>
            <span className="text-xl font-black text-slate-900">{job.salary}</span>
          </div>

          {job.alreadyApplied ? (
            <div className="text-right">
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200 inline-block">
                ✓ Applied ({job.applicationStatus || 'Under Review'})
              </span>
            </div>
          ) : (
            <button
              onClick={handleApplyClick}
              className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
              id="btn-apply-bottom"
            >
              <Send className="w-4 h-4" />
              Apply for {job.title}
            </button>
          )}
        </div>

      </div>

      {/* Apply Modal Component */}
      <ApplyModal
        job={job}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSuccess={handleApplySuccess}
      />

    </div>
  );
}
