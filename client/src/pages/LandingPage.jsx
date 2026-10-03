import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import JobCard from '../components/common/JobCard';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Search,
  Zap,
  Target,
  ShieldCheck,
  TrendingUp,
  Code2,
  Database,
  FileEdit,
  GraduationCap,
  Headphones,
  LineChart,
  Palette,
  FlaskConical
} from 'lucide-react';

export default function LandingPage() {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadJobs() {
      try {
        const res = await api.jobs.getAll();
        if (res.success && res.jobs) {
          setFeaturedJobs(res.jobs.slice(0, 3));
        }
      } catch (err) {
        console.warn('Could not load landing jobs:', err);
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, []);

  const categories = [
    { name: 'Software Development', icon: Code2, count: '45+ openings', color: 'from-blue-500/10 to-indigo-500/10 text-indigo-600', query: 'Technology' },
    { name: 'Data Entry', icon: Database, count: '30+ openings', color: 'from-emerald-500/10 to-teal-500/10 text-emerald-600', query: 'Data Entry' },
    { name: 'Content Writing', icon: FileEdit, count: '28+ openings', color: 'from-amber-500/10 to-orange-500/10 text-amber-600', query: 'Content' },
    { name: 'Online Tutoring', icon: GraduationCap, count: '50+ openings', color: 'from-purple-500/10 to-fuchsia-500/10 text-purple-600', query: 'Education' },
    { name: 'Customer Support', icon: Headphones, count: '22+ openings', color: 'from-rose-500/10 to-pink-500/10 text-rose-600', query: 'Customer Support' },
    { name: 'Digital Marketing', icon: LineChart, count: '35+ openings', color: 'from-sky-500/10 to-cyan-500/10 text-sky-600', query: 'Marketing' },
    { name: 'Graphic Design', icon: Palette, count: '18+ openings', color: 'from-violet-500/10 to-indigo-500/10 text-violet-600', query: 'Design' },
    { name: 'Research Assistant', icon: FlaskConical, count: '15+ openings', color: 'from-teal-500/10 to-emerald-500/10 text-teal-600', query: 'Research' }
  ];

  return (
    <div className="min-h-screen bg-slate-50">

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200/80 bg-gradient-to-b from-white via-indigo-50/20 to-slate-50">

        {/* Decorative backdrop shapes */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none opacity-40 overflow-hidden">
          <div className="absolute -top-24 left-1/4 w-96 h-96 bg-indigo-200/50 rounded-full blur-3xl" />
          <div className="absolute top-10 right-1/4 w-80 h-80 bg-violet-200/40 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            <span>AI-Assisted Job Discovery for Students</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Find Part-Time Jobs That <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 bg-clip-text text-transparent">Match You</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            AI-powered job discovery for students and job seekers. Find flexible opportunities based on your skills, availability, and preferences.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/jobs"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-slate-800 bg-white border border-slate-300 hover:border-indigo-400 hover:bg-slate-50 transition-all shadow-sm hover:shadow text-sm sm:text-base"
              id="hero-find-jobs"
            >
              Find Jobs
            </Link>

            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-200 text-sm sm:text-base group"
              id="hero-get-started"
            >
              Get Started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="mt-12 pt-8 border-t border-slate-200/60 max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-medium text-slate-500">
            <div className="flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Verified Employers</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Transparent AI Match</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Flexible Hours</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Free for Students</span>
            </div>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">
              Seamless Workflow
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-3">
              How It Works
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              From creating your profile to landing a flexible role, here is your path in 4 simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">

            {/* Step 1 */}
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 hover:border-indigo-300 transition-all duration-200 hover:shadow-md group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black text-lg flex items-center justify-center mb-4 shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Create Your Profile</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Add your degree, skills (Python, React, Excel), preferred locations, and schedule availability.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 hover:border-indigo-300 transition-all duration-200 hover:shadow-md group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black text-lg flex items-center justify-center mb-4 shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Discover AI-Matched Jobs</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Our smart matching engine scores openings based on skill overlap, schedule compatibility, and remote preference.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 hover:border-indigo-300 transition-all duration-200 hover:shadow-md group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black text-lg flex items-center justify-center mb-4 shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Apply Easily</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Generate a tailored cover message with AI in one click, review or edit, and submit with zero friction.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 hover:border-indigo-300 transition-all duration-200 hover:shadow-md group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black text-lg flex items-center justify-center mb-4 shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
                4
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Track Your Application</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Follow real-time progress on your visual timeline from Under Review to Interview and Final Selection.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* POPULAR JOB CATEGORIES */}
      <section className="py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">
                Explore Fields
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-3">
                Popular Job Categories
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Hand-picked part-time openings with competitive monthly stipends.
              </p>
            </div>

            <Link
              to="/jobs"
              className="mt-4 sm:mt-0 text-sm font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
            >
              Browse all categories &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={idx}
                  to={`/jobs?category=${encodeURIComponent(cat.query)}`}
                  className="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-50 transition-all duration-200 group flex flex-col justify-between"
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${cat.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-indigo-600 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">{cat.count}</p>
                  </div>
                </Link>
              );
            })}
          </div>

        </div>
      </section>

      {/* AI MATCHING EXPLANATION SECTION */}
      <section id="ai-matching" className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left Explanation */}
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">
                Smart Algorithm
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 leading-tight">
                How Our AI Matching Works
              </h2>
              <p className="text-slate-600 text-base mt-4 leading-relaxed">
                «Our AI analyzes your profile and job requirements to identify opportunities that fit your skills and preferences.»
              </p>

              <div className="mt-6 space-y-3.5">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    50%
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Skill Compatibility</h4>
                    <p className="text-xs text-slate-500">Evaluates overlap with requested tools like Python, React, SQL, and communication.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    15%
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Location & Remote Preferences</h4>
                    <p className="text-xs text-slate-500">Prioritizes 100% remote student roles or near-campus hybrid positions.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    15%
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Availability Fit</h4>
                    <p className="text-xs text-slate-500">Matches weekend, weekday evening, or flexible schedules without class conflicts.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    20%
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Education & Job Type</h4>
                    <p className="text-xs text-slate-500">Considers your degree background and preferred engagement format.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm shadow-md shadow-indigo-200 transition-all"
                >
                  Create Your Student Profile
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Interactive Mockup Card */}
            <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 p-6 sm:p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <div>
                  <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">Live AI Evaluation</span>
                  <h4 className="text-lg font-bold text-white">Python Intern @ TechNova</h4>
                </div>
                <div className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-bold text-sm flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  92% Match
                </div>
              </div>

              {/* Match reasons */}
              <div className="space-y-3 text-xs leading-relaxed text-slate-300 mb-6">
                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <p className="text-white font-semibold mb-0.5">✓ Strong Skill Match</p>
                  <p className="text-slate-400">Your Python, SQL, and Git skills match 3 out of 3 core requirements.</p>
                </div>

                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <p className="text-white font-semibold mb-0.5">✓ Remote & Flexible Schedule</p>
                  <p className="text-slate-400">Weekend hours fit perfectly with your stated availability.</p>
                </div>
              </div>

              {/* Skill gap preview */}
              <div className="border-t border-white/10 pt-4">
                <span className="text-xs font-semibold text-slate-300 block mb-2">Skill Gap Analysis:</span>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    ✓ Python
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    ✓ SQL
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    ✓ Git
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    ○ REST APIs (Learnable)
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* SAMPLE FEATURED JOBS */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">
                Featured Roles
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-3">
                Latest Part-Time Openings
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Explore real part-time jobs open for college students right now.
              </p>
            </div>

            <Link
              to="/jobs"
              className="mt-4 sm:mt-0 px-4 py-2 bg-white text-indigo-600 font-semibold text-sm rounded-xl border border-slate-200 hover:border-indigo-300 transition-colors shadow-sm"
            >
              View all 10+ jobs &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredJobs.map(job => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>

        </div>
      </section>

      {/* BOTTOM CTA BANNER */}
      <section className="bg-gradient-to-r from-indigo-900 to-indigo-950 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Discover Flexible Part-Time Jobs?
          </h2>
          <p className="text-indigo-200 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Join students who use TalentAI to discover part-time roles matching their skills and schedule.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-3.5 bg-white text-indigo-900 font-bold rounded-xl text-sm sm:text-base shadow-lg hover:bg-indigo-50 transition-colors"
            >
              Sign Up Free
            </Link>
            <Link
              to="/jobs"
              className="px-8 py-3.5 bg-indigo-800/80 text-white font-semibold rounded-xl text-sm sm:text-base border border-indigo-700 hover:bg-indigo-800 transition-colors"
            >
              Browse Openings
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
