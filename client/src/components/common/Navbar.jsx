import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import {
  Sparkles,
  Briefcase,
  Compass,
  FileText,
  User,
  Bell,
  LogOut,
  Menu,
  X,
  CheckCircle2,
  Clock,
  ChevronDown
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkClasses = ({ isActive }) =>
    `inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
      ? 'bg-indigo-50 text-indigo-700'
      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
    }`;

  const mobileNavLinkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-base font-medium transition-colors ${isActive
      ? 'bg-indigo-50 text-indigo-700 font-semibold'
      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Brand Logo */}
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-700 bg-clip-text text-transparent">
                  TalentAI
                </span>
                <span className="px-1.5 py-0.5 text-[10px] uppercase tracking-wider font-semibold rounded bg-indigo-100 text-indigo-700">
                  Student
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block -mt-1 font-medium">Part-Time Career Engine</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" className={navLinkClasses} id="nav-dashboard">
                  <Compass className="w-4 h-4" />
                  Dashboard
                </NavLink>

                <NavLink to="/jobs" className={navLinkClasses} id="nav-browse-jobs">
                  <Briefcase className="w-4 h-4" />
                  Browse Jobs
                </NavLink>

                <NavLink to="/recommendations" className={navLinkClasses} id="nav-ai-recommendations">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  AI Matches
                </NavLink>

                <NavLink to="/applications" className={navLinkClasses} id="nav-my-applications">
                  <FileText className="w-4 h-4" />
                  My Applications
                </NavLink>

                <NavLink to="/profile" className={navLinkClasses} id="nav-profile">
                  <User className="w-4 h-4" />
                  Profile
                </NavLink>
              </>
            ) : (
              <>
                <Link to="/#how-it-works" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900">
                  How It Works
                </Link>
                <Link to="/jobs" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900">
                  Explore Jobs
                </Link>
                <Link to="/#ai-matching" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900">
                  AI Matching
                </Link>
              </>
            )}
          </nav>

          {/* Right Header Section */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Notification Bell Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setNotifDropdownOpen(!notifDropdownOpen);
                      setUserDropdownOpen(false);
                    }}
                    className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
                    aria-label="View notifications"
                    id="notifications-button"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Dropdown Panel */}
                  {notifDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 text-sm">Notifications</span>
                          {unreadCount > 0 && (
                            <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
                              {unreadCount} new
                            </span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-8 text-center text-slate-400 text-sm">
                            <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
                            No notifications yet
                          </div>
                        ) : (
                          notifications.slice(0, 5).map(n => (
                            <div
                              key={n._id}
                              onClick={() => markAsRead(n._id)}
                              className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer ${!n.read ? 'bg-indigo-50/40' : ''
                                }`}
                            >
                              <div className="flex items-start gap-2.5">
                                <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${!n.read ? 'bg-indigo-600' : 'bg-transparent'}`} />
                                <div className="flex-1">
                                  <p className="text-xs font-semibold text-slate-900">{n.title}</p>
                                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
                                  <span className="text-[10px] text-slate-400 mt-1 block">
                                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="border-t border-slate-100 px-4 py-2 text-center">
                        <Link
                          to="/applications"
                          onClick={() => setNotifDropdownOpen(false)}
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                        >
                          View Application Updates &rarr;
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setUserDropdownOpen(!userDropdownOpen);
                      setNotifDropdownOpen(false);
                    }}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full hover:bg-slate-100 transition-colors border border-slate-200/80"
                    id="user-menu-button"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
                    </div>
                    <span className="text-sm font-medium text-slate-700 hidden sm:block max-w-[120px] truncate">
                      {user?.name || 'Student'}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                        <p className="text-sm font-bold text-slate-800 truncate">{user?.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <User className="w-4 h-4 text-slate-500" />
                          My Profile ({user?.profileCompletion || 20}%)
                        </Link>
                        <Link
                          to="/applications"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <FileText className="w-4 h-4 text-slate-500" />
                          Track Applications
                        </Link>
                      </div>

                      <div className="border-t border-slate-100 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 text-left font-medium"
                          id="btn-logout"
                        >
                          <LogOut className="w-4 h-4" />
                          Log Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors"
                  id="nav-login"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-200 transition-all hover:shadow"
                  id="nav-get-started"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClasses}>
                <Compass className="w-5 h-5 text-indigo-600" />
                Dashboard
              </NavLink>
              <NavLink to="/jobs" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClasses}>
                <Briefcase className="w-5 h-5 text-indigo-600" />
                Browse Jobs
              </NavLink>
              <NavLink to="/recommendations" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClasses}>
                <Sparkles className="w-5 h-5 text-indigo-600" />
                AI Recommendations
              </NavLink>
              <NavLink to="/applications" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClasses}>
                <FileText className="w-5 h-5 text-indigo-600" />
                My Applications
              </NavLink>
              <NavLink to="/profile" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClasses}>
                <User className="w-5 h-5 text-indigo-600" />
                Profile Setup
              </NavLink>
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-base font-semibold text-rose-600 hover:bg-rose-50 rounded-lg"
                >
                  <LogOut className="w-5 h-5" />
                  Log Out
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-slate-700 font-medium">
                How It Works
              </Link>
              <Link to="/jobs" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-slate-700 font-medium">
                Browse Jobs
              </Link>
              <Link to="/#ai-matching" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-slate-700 font-medium">
                AI Matching
              </Link>
              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center text-slate-700 font-semibold border border-slate-300 rounded-xl"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center text-white bg-indigo-600 font-semibold rounded-xl"
                >
                  Get Started Free
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
}
