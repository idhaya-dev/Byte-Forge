const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Reusable fetch wrapper for API calls that automatically includes
 * credentials (cookies) and JSON headers.
 */
export const apiFetch = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  
  // Set up default headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
    // CRITICAL: Must include credentials to send/receive HTTP-only session cookies
    credentials: 'include', 
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  let response = await fetch(url, config);

  // Parse JSON response
  let data = null;
  let contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  }

  // Auto-refresh session token on 401 if not loading login or refreshing
  if (response.status === 401 && endpoint !== '/auth/login' && endpoint !== '/auth/refresh') {
    try {
      const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (refreshResponse.ok) {
        // Token refreshed successfully, retry the original request
        response = await fetch(url, config);
        contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        }
      }
    } catch (refreshErr) {
      console.error('Session silent refresh failed:', refreshErr);
    }
  }

  if (!response.ok) {
    const errorMsg = data?.message || `HTTP error! Status: ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
};
