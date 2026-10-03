import React from 'react';
import { Link } from 'react-router-dom';
import MatchBadge from './MatchBadge';
import {
  Building2,
  MapPin,
  IndianRupee,
  Clock,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function JobCard({ job }) {
  const matchScore = job.aiMatchScore || 75;
  const matchReason = job.aiReasons && job.aiReasons.length > 0
    ? job.aiReasons[0]
    : 'Aligns with student profile and flexible hours.';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-300 p-5 sm:p-6 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-50/50 flex flex-col justify-between group relative overflow-hidden">

      {/* Top Banner with Match score and already applied state */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <span className="inline-block text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full mb-1.5 uppercase tracking-wider">
              {job.category}
            </span>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
              <Link to={`/jobs/${job._id}`}>{job.title}</Link>
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-medium text-slate-700">{job.company}</span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            <MatchBadge score={matchScore} size="sm" />
            {job.alreadyApplied && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Applied
              </span>
            )}
          </div>
        </div>

        {/* Key Job Metadata: Location, Mode, Salary, Type */}
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 my-3.5 py-2.5 px-3 bg-slate-50/80 rounded-xl border border-slate-100">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">{job.location} • <strong className="text-slate-800">{job.workMode}</strong></span>
          </div>

          <div className="flex items-center gap-1.5">
            <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-bold text-slate-800">{job.salary}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">{job.jobType}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">{job.duration || '3 Months'}</span>
          </div>
        </div>

        {/* Required Skills Badges */}
        <div className="flex flex-wrap gap-1.5 my-3">
          {(job.skills || []).slice(0, 4).map((skill, idx) => (
            <span
              key={idx}
              className="text-xs bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded-md hover:bg-slate-200 transition-colors"
            >
              {skill}
            </span>
          ))}
          {(job.skills || []).length > 4 && (
            <span className="text-xs text-slate-400 px-1 py-0.5 font-medium">
              +{(job.skills || []).length - 4} more
            </span>
          )}
        </div>

        {/* Why this matches snippet */}
        <div className="bg-indigo-50/50 border border-indigo-100/80 rounded-xl p-2.5 my-3 flex items-start gap-2 text-xs text-slate-700 leading-relaxed">
          <Sparkles className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-indigo-950">Why this matches: </span>
            <span className="text-slate-600">{matchReason}</span>
          </div>
        </div>
      </div>

      {/* Card Action Button */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
        <span className="text-[11px] text-slate-400">
          Posted recently
        </span>
        <Link
          to={`/jobs/${job._id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 group-hover:translate-x-0.5 transition-all"
        >
          View Job
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
}
