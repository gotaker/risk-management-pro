// Authentication Service
const STORAGE_KEYS = {
  AUTH_TOKEN: 'erm_auth_token',
  USER_DATA: 'erm_user_data',
  SESSION_EXPIRY: 'erm_session_expiry'
};

const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Check if session is valid
export const isSessionValid = () => {
  const expiry = localStorage.getItem(STORAGE_KEYS.SESSION_EXPIRY);
  if (!expiry) return false;
  
  const expiryTime = parseInt(expiry);
  return Date.now() < expiryTime;
};

// Get current authenticated user
export const getCurrentUser = () => {
  if (!isSessionValid()) {
    clearSession();
    return null;
  }
  
  const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
  return userData ? JSON.parse(userData) : null;
};

// Set authenticated user
export const setAuthenticatedUser = (userData) => {
  const expiryTime = Date.now() + SESSION_DURATION;
  
  localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
  localStorage.setItem(STORAGE_KEYS.SESSION_EXPIRY, expiryTime.toString());
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, generateToken());
  
  return userData;
};

// Clear session
export const clearSession = () => {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  localStorage.removeItem(STORAGE_KEYS.SESSION_EXPIRY);
};

// Generate simple token
const generateToken = () => {
  return 'erm_' + Math.random().toString(36).substr(2) + Date.now().toString(36);
};

// Get session expiry info
export const getSessionExpiryInfo = () => {
  const expiry = localStorage.getItem(STORAGE_KEYS.SESSION_EXPIRY);
  if (!expiry) return null;
  
  const expiryTime = parseInt(expiry);
  const now = Date.now();
  const timeRemaining = expiryTime - now;
  
  if (timeRemaining <= 0) return null;
  
  const hoursRemaining = Math.floor(timeRemaining / (60 * 60 * 1000));
  const minutesRemaining = Math.floor((timeRemaining % (60 * 60 * 1000)) / (60 * 1000));
  
  return {
    expiryTime,
    timeRemaining,
    hoursRemaining,
    minutesRemaining
  };
};

// Simulate GitHub OAuth (in production, this would use real GitHub OAuth)
export const initiateGitHubLogin = () => {
  // In production, redirect to GitHub OAuth
  // window.location.href = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;
  
  // For demo purposes, return a promise that simulates GitHub auth
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        githubData: {
          login: 'demo_user',
          name: '',
          email: '',
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`
        }
      });
    }, 1000);
  });
};

// Manual registration
export const registerUser = (userData) => {
  const user = {
    id: `user_${Date.now()}`,
    ...userData,
    createdAt: new Date().toISOString(),
    loginMethod: 'github'
  };
  
  return setAuthenticatedUser(user);
};

// Logout
export const logout = () => {
  clearSession();
  window.location.href = '/';
};

// Check authentication and redirect
export const requireAuth = () => {
  if (!isSessionValid()) {
    return false;
  }
  return true;
};
