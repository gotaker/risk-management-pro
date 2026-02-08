import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { getCurrentUser, setAuthenticatedUser, clearSession } from './services/authService';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const RiskList = lazy(() => import('./pages/RiskList'));
const Projects = lazy(() => import('./pages/Projects'));
const Settings = lazy(() => import('./pages/Settings'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600 font-medium">Loading...</p>
    </div>
  </div>
);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication on mount
    const user = getCurrentUser();
    setIsAuthenticated(!!user);
    setIsLoading(false);

    // Set up session check interval (every minute)
    const interval = setInterval(() => {
      const currentUser = getCurrentUser();
      if (!currentUser && isAuthenticated) {
        // Session expired
        setIsAuthenticated(false);
        window.location.href = '/';
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleLogin = (userData) => {
    setAuthenticatedUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    clearSession();
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (!isAuthenticated) {
    return (
      <BrowserRouter>
        <LandingPage onLogin={handleLogin} />
      </BrowserRouter>
    );
  }

  return (
    <AppProvider>
      <BrowserRouter>
        <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          <Sidebar onLogout={handleLogout} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header onLogout={handleLogout} />
            <main className="flex-1 overflow-y-auto p-6">
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/risks" element={<RiskList />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
