import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useNotifications } from '../context/NotificationContext';
import StatusTimeline from '../components/common/StatusTimeline';
import MatchBadge from '../components/common/MatchBadge';
import {
  FileText,
  Building2,
  MapPin,
  Calendar,
  IndianRupee,
  Loader2,
  ArrowRight,
  Briefcase,
  Sparkles,
  Sliders,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';

const STATUS_FILTERS = ['All', 'Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected'];

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [updatingId, setUpdatingId] = useState(null);
  const { fetchNotifications } = useNotifications();

  const loadApplications = async () => {
    try {
      setLoading(true);
      const res = await api.applications.getMyApplications();
      if (res.success) {
        setApplications(res.applications || []);
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  // Demo status advancement helper for testing / presentation
  const handleAdvanceStatus = async (appId, nextStatus) => {
    setUpdatingId(appId);
    try {
      const res = await api.applications.simulateStatus(appId, nextStatus);
      if (res.success) {
        setApplications(prev => prev.map(a => a._id === appId ? { ...a, status: nextStatus, statusTimeline: res.application.statusTimeline } : a));
        fetchNotifications();
      }
    } catch (err) {
      console.error('Failed to advance status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredApps = activeFilter === 'All'
    ? applications
    : applications.filter(a => a.status === activeFilter);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-full">
            Track Progress
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
            My Applications
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track your application lifecycle and review stage-by-stage hiring status
          </p>
        </div>

        <Link
          to="/jobs"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-colors self-start sm:self-auto"
        >
          <Briefcase className="w-4 h-4" />
          Apply for More Jobs
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {STATUS_FILTERS.map(st => {
          const count = st === 'All'
            ? applications.length
            : applications.filter(a => a.status === st).length;
          const active = activeFilter === st;

          return (
            <button
              key={st}
              onClick={() => setActiveFilter(st)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${active
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
            >
              <span>{st}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${active ? 'bg-indigo-800 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-200">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-500">Loading your applications...</p>
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No applications found</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            {activeFilter === 'All'
              ? 'You have not submitted any job applications yet. Browse AI-matched jobs and apply in one click!'
              : `No applications currently in '${activeFilter}' stage.`}
          </p>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-indigo-700 transition-colors"
          >
            Explore Available Jobs
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredApps.map(app => {
            const job = app.job || {};
            const appliedDateStr = new Date(app.appliedAt || app.createdAt).toLocaleDateString([], {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

            return (
              <div
                key={app._id}
                className="bg-white rounded-3xl border border-slate-200/90 hover:border-indigo-300 p-6 sm:p-7 shadow-sm transition-all space-y-6"
              >
                {/* Header Information */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full uppercase">
                        {job.category || 'General'}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        Applied on {appliedDateStr}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-slate-900 hover:text-indigo-600 transition-colors">
                      <Link to={`/jobs/${job._id}`}>{job.title || 'Part-Time Role'}</Link>
                    </h2>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-0.5">
                      <span className="flex items-center gap-1 font-semibold text-slate-800">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {job.company || 'Company'}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {job.location || 'Remote'} ({job.workMode || 'Remote'})
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-bold text-emerald-700">
                        <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                        {job.salary || 'Stipend'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-start sm:self-auto flex-shrink-0">
                    <MatchBadge score={app.matchScore || 75} size="md" />
                  </div>
                </div>

                {/* Status Timeline (Section 20 Requirement) */}
                <div className="bg-slate-50/70 p-4 sm:p-6 rounded-2xl border border-slate-100">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Application Status Timeline
                  </span>
                  <StatusTimeline status={app.status} timeline={app.statusTimeline} />
                </div>

                {/* Cover Message Preview */}
                {app.coverMessage && (
                  <div className="text-xs text-slate-600 bg-indigo-50/30 border border-indigo-50 rounded-2xl p-4">
                    <span className="font-bold text-indigo-950 block mb-1">Your Application Note:</span>
                    <p className="line-clamp-3 italic leading-relaxed text-slate-700">
                      "{app.coverMessage}"
                    </p>
                  </div>
                )}

                {/* Footer Actions & Simulation Helper */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <Link
                    to={`/jobs/${job._id}`}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
                  >
                    View Original Job Posting &rarr;
                  </Link>

                  {/* Demonstration Status Advancer (for evaluation demo) */}
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-medium text-[11px]">Demo status change:</span>
                    <select
                      value={app.status}
                      disabled={updatingId === app._id}
                      onChange={(e) => handleAdvanceStatus(app._id, e.target.value)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-700 hover:border-indigo-400 outline-none cursor-pointer"
                    >
                      <option value="Applied">Applied</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Interview">Interview</option>
                      <option value="Selected">Selected</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
