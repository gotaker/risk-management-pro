import React, { createContext, useContext, useState, useEffect } from 'react';
import { projectsAPI, risksAPI, usersAPI } from '../services/dataService';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [risks, setRisks] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    const projectsData = projectsAPI.getAll();
    const risksData = risksAPI.getAll();
    const user = usersAPI.getCurrentUser();
    
    setProjects(projectsData);
    setRisks(risksData);
    setCurrentUser(user);
    
    if (projectsData.length > 0 && !selectedProject) {
      setSelectedProject(projectsData[0].id);
    }
    
    setLoading(false);
  };

  const refreshData = () => {
    loadData();
  };

  const value = {
    projects,
    risks,
    currentUser,
    selectedProject,
    setSelectedProject,
    loading,
    refreshData
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
