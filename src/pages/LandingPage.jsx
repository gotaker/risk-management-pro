import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Github, Shield, TrendingUp, Users, BarChart3, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { initiateGitHubLogin } from '../services/authService';

const LandingPage = ({ onLogin }) => {
  const [showRegistration, setShowRegistration] = useState(false);
  const navigate = useNavigate();

  const handleGitHubLogin = async () => {
    const result = await initiateGitHubLogin();
    if (result.success) {
      setShowRegistration(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Risk Manager Pro</h1>
                <p className="text-xs text-gray-600">Enterprise Edition</p>
              </div>
            </div>
            <button
              onClick={handleGitHubLogin}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {!showRegistration ? (
        <>
          {/* Hero Section */}
          <div className="max-w-7xl mx-auto px-6 pt-20 pb-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                  <Sparkles className="w-4 h-4" />
                  Next-Generation Risk Management
                </div>
                
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Manage Enterprise Risks with
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> AI Power</span>
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed">
                  Transform your risk management with intelligent insights, real-time collaboration, 
                  and beautiful visualizations. Built for modern enterprises.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleGitHubLogin}
                    className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3"
                  >
                    <Github className="w-6 h-6" />
                    Continue with GitHub
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  
                  <button className="px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-200 hover:border-blue-600">
                    Learn More
                  </button>
                </div>

                <div className="flex items-center gap-8 pt-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-600">Free to start</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-600">No credit card</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-600">24/7 support</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-3xl opacity-20"></div>
                <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
                  <img 
                    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23f0f9ff' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='20' fill='%230ea5e9' text-anchor='middle' dominant-baseline='middle'%3EDashboard Preview%3C/text%3E%3C/svg%3E"
                    alt="Dashboard Preview"
                    className="w-full rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="max-w-7xl mx-auto px-6 py-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Everything you need to manage risks
              </h2>
              <p className="text-xl text-gray-600">
                Powerful features designed for enterprise risk management
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<TrendingUp className="w-8 h-8" />}
                title="AI-Powered Insights"
                description="Get intelligent recommendations and risk predictions powered by advanced analytics"
                color="blue"
              />
              <FeatureCard
                icon={<BarChart3 className="w-8 h-8" />}
                title="Beautiful Dashboards"
                description="Interactive heat maps, charts, and visualizations that make risk data actionable"
                color="indigo"
              />
              <FeatureCard
                icon={<Users className="w-8 h-8" />}
                title="Team Collaboration"
                description="Real-time collaboration with comments, mentions, and role-based access control"
                color="purple"
              />
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid md:grid-cols-3 gap-8 text-center text-white">
                <div>
                  <div className="text-5xl font-bold mb-2">100+</div>
                  <div className="text-blue-100">Enterprise Features</div>
                </div>
                <div>
                  <div className="text-5xl font-bold mb-2">24/7</div>
                  <div className="text-blue-100">Real-time Monitoring</div>
                </div>
                <div>
                  <div className="text-5xl font-bold mb-2">99.9%</div>
                  <div className="text-blue-100">Uptime Guarantee</div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <RegistrationForm onComplete={onLogin} />
      )}
    </div>
  );
};

const FeatureCard = ({ icon, title, description, color }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    indigo: 'from-indigo-500 to-indigo-600',
    purple: 'from-purple-500 to-purple-600'
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
      <div className={`w-16 h-16 bg-gradient-to-br ${colorClasses[color]} rounded-xl flex items-center justify-center text-white mb-6`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
};

const RegistrationForm = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'risk_manager',
    location: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onComplete(formData);
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-200">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h2>
          <p className="text-gray-600">Just a few details to get you started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="John Smith"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="john.smith@company.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Role *
            </label>
            <select
              required
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="admin">Administrator</option>
              <option value="risk_manager">Risk Manager</option>
              <option value="project_manager">Project Manager</option>
              <option value="executive">Executive</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="San Francisco, CA"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Complete Registration
          </button>

          <p className="text-center text-sm text-gray-600">
            By registering, you agree to our Terms of Service and Privacy Policy.
            <br />
            Your session will remain active for 24 hours.
          </p>
        </form>
      </div>
    </div>
  );
};

export default LandingPage;
