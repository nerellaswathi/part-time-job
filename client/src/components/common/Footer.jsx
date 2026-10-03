import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">

          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">TalentAI</span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              AI-assisted part-time job discovery platform for college students and job seekers. Find verified, flexible opportunities tailored to your real skills, schedule, and preferences.
            </p>
            <div className="text-xs text-indigo-400 bg-indigo-950/60 border border-indigo-900/50 rounded-lg p-2.5 max-w-md">
              ✨ <strong>Transparent AI Scoring:</strong> Evaluates skill matches, commute / remote modes, availability slots, and career interests.
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/jobs" className="hover:text-indigo-400 transition-colors">Browse All Jobs</Link>
              </li>
              <li>
                <Link to="/recommendations" className="hover:text-indigo-400 transition-colors">AI Recommendations</Link>
              </li>
              <li>
                <Link to="/#how-it-works" className="hover:text-indigo-400 transition-colors">How It Works</Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-indigo-400 transition-colors">Student Profile Setup</Link>
              </li>
            </ul>
          </div>

          {/* Job Categories */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Popular Categories</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/jobs?category=Technology" className="hover:text-indigo-400 transition-colors">Software & Tech</Link>
              </li>
              <li>
                <Link to="/jobs?category=Education" className="hover:text-indigo-400 transition-colors">Online Tutoring</Link>
              </li>
              <li>
                <Link to="/jobs?category=Content" className="hover:text-indigo-400 transition-colors">Content Writing</Link>
              </li>
              <li>
                <Link to="/jobs?category=Marketing" className="hover:text-indigo-400 transition-colors">Digital Marketing</Link>
              </li>
              <li>
                <Link to="/jobs?category=Data%20Entry" className="hover:text-indigo-400 transition-colors">Data Entry & Ops</Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} TalentAI. Built for Students & Job Seekers.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for flexible student careers.
          </p>
        </div>
      </div>
    </footer>
  );
}
