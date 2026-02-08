import React from 'react';
import { Bell, User } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { getCurrentUser } from '../services/authService';

const Header = ({ onLogout }) => {
  const { projects, selectedProject, setSelectedProject } = useApp();
  const currentUser = getCurrentUser();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Active Project</label>
            <select
              value={selectedProject || ''}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
              {currentUser?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="text-sm">
              <div className="font-semibold text-gray-900">{currentUser?.name || 'User'}</div>
              <div className="text-xs text-gray-500">{currentUser?.location || 'Not set'}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
