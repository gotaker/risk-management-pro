import React from 'react';
import { User, Shield, Database, Download } from 'lucide-react';
import { risksAPI, projectsAPI } from '../services/dataService';

const Settings = () => {
  const handleExportData = () => {
    const data = {
      projects: projectsAPI.getAll(),
      risks: risksAPI.getAll(),
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `risk-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your application preferences</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* User Profile */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
            <User className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">User Profile</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-600 mb-4">User management features coming soon.</p>
            <div className="space-y-3 text-sm text-gray-600">
              <div>• Update profile information</div>
              <div>• Change password</div>
              <div>• Notification preferences</div>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
            <Shield className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Security</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-600 mb-4">Security settings and access control.</p>
            <div className="space-y-3 text-sm text-gray-600">
              <div>• Two-factor authentication</div>
              <div>• Role-based access control</div>
              <div>• Audit logs</div>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
            <Database className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Data Management</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Export Data</h3>
              <p className="text-sm text-gray-600 mb-3">
                Download all your project and risk data as JSON
              </p>
              <button
                onClick={handleExportData}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export Data
              </button>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h3 className="font-medium text-gray-900 mb-2">Import Data</h3>
              <p className="text-sm text-gray-600 mb-3">
                Coming soon: Import risk data from Excel or JSON
              </p>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h3 className="font-medium text-gray-900 mb-2">Database Backup</h3>
              <p className="text-sm text-gray-600">
                All data is automatically saved to browser local storage. For production deployment, integrate with a backend database.
              </p>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">About</h2>
          </div>
          <div className="p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Enterprise Risk Management System</h3>
            <p className="text-sm text-gray-600 mb-4">Version 1.0.0</p>
            <p className="text-sm text-gray-600">
              A comprehensive risk assessment and management application for enterprise IT projects.
              Built with React, Tailwind CSS, and modern web technologies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
