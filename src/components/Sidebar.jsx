import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, AlertTriangle, FolderOpen, Settings, LogOut, Clock } from 'lucide-react';
import { getCurrentUser, getSessionExpiryInfo } from '../services/authService';

const Sidebar = ({ onLogout }) => {
  const currentUser = getCurrentUser();
  const sessionInfo = getSessionExpiryInfo();

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/risks', icon: AlertTriangle, label: 'Risk Register' },
    { path: '/projects', icon: FolderOpen, label: 'Projects' },
    { path: '/settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <div className="w-64 bg-gray-900 text-white h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold">Risk Manager Pro</h1>
        <p className="text-xs text-gray-400 mt-1">Enterprise Edition</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Section */}
      <div className="border-t border-gray-800">
        {/* Session Timer */}
        {sessionInfo && (
          <div className="px-4 py-3 bg-gray-800/50">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Clock className="w-3 h-3" />
              <span>Session: {sessionInfo.hoursRemaining}h {sessionInfo.minutesRemaining}m remaining</span>
            </div>
          </div>
        )}
        
        {/* User Info */}
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {currentUser?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-white truncate">{currentUser?.name || 'User'}</div>
              <div className="text-xs text-gray-400 capitalize truncate">
                {currentUser?.role?.replace('_', ' ') || 'User'}
              </div>
            </div>
          </div>
          
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800 rounded-lg cursor-pointer transition-colors text-gray-300 hover:text-white"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
