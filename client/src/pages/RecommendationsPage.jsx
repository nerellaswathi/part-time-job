import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import JobCard from '../components/common/JobCard';
import {
  Sparkles,
  Loader2,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  SlidersHorizontal,
  Briefcase
} from 'lucide-react';

export default function RecommendationsPage() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecs() {
      try {
        setLoading(true);
        const res = await api.ai.getRecommendations();
        if (res.success) {
          setRecommendations(res.recommendations || []);
        }
      } catch (err) {
        console.error('Recommendations error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchRecs();
  }, [user?.skills, user?.availability, user?.preferredCategories, user?.preferredJobTypes]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-indigo-200 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            AI Compatibility Ranked
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Jobs Recommended For You
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Every opening below is evaluated by our AI matching engine against your profile skills, location, availability schedule, and degree background.
          </p>
        </div>
      </div>

      {/* Explanatory Callout */}
      <div className="bg-indigo-50 border border-indigo-200/80 rounded-2xl p-4 sm:p-5 flex items-start gap-3 text-xs sm:text-sm text-indigo-950">
        <Sparkles className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">Transparent AI Match Weights:</p>
          <p className="text-indigo-800 text-xs">
            Skill Overlap (50%) + Remote / Location Fit (15%) + Availability Schedule (15%) + Job Type Preference (10%) + Education Match (10%).
          </p>
        </div>
      </div>

      {/* Recommendations Grid */}
      {loading ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-200">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-500">Evaluating your profile against all job openings...</p>
        </div>
      ) : recommendations.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Recommendations Yet</h3>
          <p className="text-xs text-slate-500">Please add your skills in your profile to trigger AI recommendations.</p>
          <Link to="/profile" className="inline-block mt-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold">
            Complete Profile Setup
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((job, idx) => (
            <div key={job._id} className="relative">
              {/* Rank Badge */}
              <div className="absolute -top-3 -left-2 z-10 w-7 h-7 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center shadow-md">
                #{idx + 1}
              </div>
              <JobCard job={job} />
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
