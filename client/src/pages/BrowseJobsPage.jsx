import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import JobCard from '../components/common/JobCard';
import {
  Search,
  Filter,
  ArrowUpDown,
  X,
  Loader2,
  Briefcase,
  MapPin,
  Sparkles,
  SlidersHorizontal,
  RotateCcw
} from 'lucide-react';

const CATEGORIES = [
  'All', 'Technology', 'Education', 'Marketing', 'Data Entry',
  'Customer Support', 'Design', 'Content', 'Research'
];

const JOB_TYPES = ['All', 'Part-time', 'Internship', 'Freelance', 'Weekend'];
const WORK_MODES = ['All', 'Remote', 'Hybrid', 'On-site'];

export default function BrowseJobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Search and filter state initialized from URL params if present
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedJobType, setSelectedJobType] = useState(searchParams.get('jobType') || 'All');
  const [selectedWorkMode, setSelectedWorkMode] = useState(searchParams.get('workMode') || 'All');
  const [selectedSort, setSelectedSort] = useState(searchParams.get('sort') || 'newest');
  const [selectedSkill, setSelectedSkill] = useState(searchParams.get('skill') || '');

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Fetch jobs whenever search / filter / sort parameters change
  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true);
        const params = {
          q: searchQuery,
          category: selectedCategory,
          jobType: selectedJobType,
          workMode: selectedWorkMode,
          skill: selectedSkill,
          sort: selectedSort
        };
        const res = await api.jobs.getAll(params);
        if (res.success) {
          setJobs(res.jobs || []);
        }
      } catch (err) {
        console.error('Error fetching jobs:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, [searchQuery, selectedCategory, selectedJobType, selectedWorkMode, selectedSkill, selectedSort]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedJobType('All');
    setSelectedWorkMode('All');
    setSelectedSkill('');
    setSelectedSort('newest');
    setSearchParams({});
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'All' || selectedJobType !== 'All' || selectedWorkMode !== 'All' || selectedSkill || selectedSort !== 'newest';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      {/* Header */}
      <div>
        <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-full">
          Marketplace
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
          Browse Part-Time Jobs
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Explore flexible student opportunities scored with transparent AI compatibility
        </p>
      </div>

      {/* Top Search Bar & Sort Dropdown */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">

          {/* Main Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jobs by title, skill (Python, SQL), company, or city..."
              className="w-full pl-11 pr-10 py-3 text-sm rounded-2xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none text-slate-800 transition-all"
              id="input-job-search"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-52">
              <ArrowUpDown className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="w-full pl-10 pr-8 py-3 text-xs sm:text-sm font-semibold rounded-2xl border border-slate-200 bg-white text-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none cursor-pointer"
                id="select-job-sort"
              >
                <option value="newest">Sort: Newest</option>
                <option value="ai_match">Sort: Best AI Match ✨</option>
                <option value="salary_desc">Salary: High to Low</option>
                <option value="salary_asc">Salary: Low to High</option>
              </select>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
              className="md:hidden p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl text-slate-700 flex items-center justify-center"
              aria-label="Filter jobs"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Quick Filter Badges for Desktop */}
        <div className={`pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 ${filterDrawerOpen ? 'block' : 'hidden md:flex'}`}>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-slate-400 mr-1">Filter by:</span>

            {/* Category Select */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-700 hover:bg-slate-100 outline-none text-xs"
              id="filter-category"
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
              ))}
            </select>

            {/* Job Type Select */}
            <select
              value={selectedJobType}
              onChange={(e) => setSelectedJobType(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-700 hover:bg-slate-100 outline-none text-xs"
              id="filter-job-type"
            >
              {JOB_TYPES.map(t => (
                <option key={t} value={t}>{t === 'All' ? 'All Job Types' : t}</option>
              ))}
            </select>

            {/* Work Mode Select */}
            <select
              value={selectedWorkMode}
              onChange={(e) => setSelectedWorkMode(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-700 hover:bg-slate-100 outline-none text-xs"
              id="filter-work-mode"
            >
              {WORK_MODES.map(m => (
                <option key={m} value={m}>{m === 'All' ? 'All Work Modes' : m}</option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset All Filters
            </button>
          )}

        </div>

      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 font-medium">
        <div>
          Showing <strong className="text-slate-900">{jobs.length}</strong> part-time opportunities
        </div>
        {selectedSort === 'ai_match' && (
          <span className="text-indigo-600 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            Sorted by student AI match score
          </span>
        )}
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-200">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-500">Finding matching jobs...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No jobs match your filter criteria</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            Try adjusting your search terms or clearing specific filters to view more student openings.
          </p>
          <button
            onClick={resetFilters}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map(job => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}

    </div>
  );
}
