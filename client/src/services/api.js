const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers
  };

  const config = {
    ...options,
    headers
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const error = new Error(data.message || 'Something went wrong. Please try again.');
      error.status = res.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please ensure the backend is running.');
    }
    throw err;
  }
}

export const api = {
  // Authentication
  auth: {
    register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
    login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    getMe: () => request('/auth/me')
  },

  // Student Profile
  profile: {
    get: () => request('/profile'),
    update: (profileData) => request('/profile', { method: 'PUT', body: JSON.stringify(profileData) })
  },

  // Jobs
  jobs: {
    getAll: (params = {}) => {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '' && val !== 'All') {
          query.append(key, val);
        }
      });
      const qs = query.toString();
      return request(`/jobs${qs ? `?${qs}` : ''}`);
    },
    getById: (id) => request(`/jobs/${id}`)
  },

  // Applications
  applications: {
    apply: (jobId, coverMessage) => request('/applications', {
      method: 'POST',
      body: JSON.stringify({ jobId, coverMessage })
    }),
    getMyApplications: () => request('/applications'),
    getById: (id) => request(`/applications/${id}`),
    simulateStatus: (id, status) => request(`/applications/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    })
  },

  // AI Matching & Intelligence
  ai: {
    getMatch: (jobId) => request('/ai/match', { method: 'POST', body: JSON.stringify({ jobId }) }),
    getRecommendations: () => request('/ai/recommendations'),
    generateCoverMessage: (jobId) => request('/ai/application-message', {
      method: 'POST',
      body: JSON.stringify({ jobId })
    }),
    getProfileAnalysis: () => request('/ai/profile-analysis')
  },

  // Notifications
  notifications: {
    getAll: () => request('/notifications'),
    markRead: (id) => request(`/notifications/${id}/read`, { method: 'PUT' }),
    markAllRead: () => request('/notifications/mark-all-read', { method: 'PUT' })
  }
};

export default api;
