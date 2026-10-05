import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import JobCard from '../components/common/JobCard';
import {
  Sparkles,
  ArrowRight,
  Briefcase,
  FileText,
  CheckCircle2,
  Search,
  Loader2,
  SlidersHorizontal,
  TrendingUp,
  UserCheck
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const [recRes, appRes] = await Promise.all([
          api.ai.getRecommendations(),
          api.applications.getMyApplications()
        ]);

        if (recRes.success) {
          setRecommendations(recRes.recommendations || []);
        }
        if (appRes.success) {
          setApplications(appRes.applications || []);
        }
      } catch (err) {
        console.warn('Dashboard fetch warning:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [user?.skills, user?.availability, user?.preferredCategories, user?.preferredJobTypes]);

  const completionPct = user?.profileCompletion || 30;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

      {/* 1. Welcome Banner & Greeting */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-indigo-200 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              AI Matching Engine Active
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              Welcome back, {user?.name || 'Student'} 👋
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
              We analyzed {recommendations.length > 0 ? recommendations.length : '10+'} part-time roles against your skills and schedule availability.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/jobs"
              className="px-5 py-2.5 rounded-xl bg-white text-indigo-950 font-bold text-xs sm:text-sm hover:bg-slate-100 transition-colors shadow-sm"
              id="dash-browse-jobs"
            >
              Browse All Jobs
            </Link>
            <Link
              to="/profile"
              className="px-5 py-2.5 rounded-xl bg-white/10 text-white border border-white/20 font-semibold text-xs sm:text-sm hover:bg-white/20 transition-colors"
              id="dash-edit-profile"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics & Profile Completion Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Profile Completion Widget (Section 10 Requirement) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Profile Status
              </span>
              <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                {completionPct}% Complete
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              Profile Completion
            </h3>

            {/* Progress bar */}
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden my-3">
              <div
                className={`h-full rounded-full transition-all duration-500 ${completionPct >= 80 ? 'bg-emerald-500' : 'bg-indigo-600'
                  }`}
                style={{ width: `${completionPct}%` }}
              />
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              {completionPct >= 80
                ? 'Your profile is fully optimized for top-accuracy AI recommendations.'
                : 'Add remaining skills and preferences to further increase your match accuracy.'}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <Link
              to="/profile"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center justify-between group"
              id="dash-complete-profile-link"
            >
              <span>Complete Profile</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Quick Stat 1: Matched Jobs */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
            <Sparkles className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Curated</span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">
              {recommendations.length} Roles
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Matched with &gt;70% compatibility</p>
          </div>
        </div>

        {/* Quick Stat 2: Active Applications */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Applied Roles</span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">
              {applications.length} Active
            </div>
            <Link to="/applications" className="text-xs font-semibold text-emerald-700 hover:underline mt-0.5 block">
              Track status timeline &rarr;
            </Link>
          </div>
        </div>

      </div>

      {/* 3. AI RECOMMENDED JOBS (Section 10 Requirement) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                AI Recommended Jobs
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Ranked in real-time according to your skills, availability, and location preferences
            </p>
          </div>

          <Link
            to="/recommendations"
            className="text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 self-start sm:self-auto"
            id="dash-view-all-recommendations"
          >
            <span>View all AI rankings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-500">Calculating AI compatibility scores...</p>
          </div>
        ) : recommendations.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
            <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No Job Recommendations Found</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">Complete your profile to unlock custom matches.</p>
            <Link to="/profile" className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold">
              Update Profile
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.slice(0, 6).map(job => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Quick Action Footer Banner */}
      <div className="bg-indigo-50/70 border border-indigo-100 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-indigo-200">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-indigo-950">Looking for a specific role or city?</h4>
            <p className="text-xs text-slate-600 mt-0.5">Filter by stipends, remote mode, weekend shifts, and technical stacks.</p>
          </div>
        </div>

        <Link
          to="/jobs"
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-indigo-200 transition-colors flex-shrink-0"
        >
          Explore Job Marketplace
        </Link>
      </div>

    </div>
  );
}
