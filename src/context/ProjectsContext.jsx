import { createContext, useState, useContext, useEffect } from 'react';

// Create the ProjectsContext
const ProjectsContext = createContext();

// Custom hook for using projects
export const useProjects = () => {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error('useProjects must be used within ProjectsProvider');
  }
  return context;
};

export const ProjectsProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch projects when the provider mounts
  useEffect(() => {
    let isCancelled = false;

    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('http://localhost:3001/projects');
        if (!response.ok) {
          throw new Error(`HTTP error, status ${response.status}`);
        }

        const data = await response.json();
        if (!isCancelled) {
          setProjects(data);
          setLoading(false);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    fetchProjects();

    // Cleanup function
    return () => {
      isCancelled = true;
    };
  }, []);

  const addProject = async (projectData) => {
    const response = await fetch('http://localhost:3001/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...projectData, id: Date.now() })
    });
    if (!response.ok) {
      throw new Error('Failed to add project');
    }
    const newProject = await response.json();
    setProjects(prev => [...prev, newProject]);
    return newProject;
  };

  const updateProject = async (id, updates) => {
    const response = await fetch(`http://localhost:3001/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!response.ok) {
      throw new Error('Failed to update project');
    }
    const updatedProject = await response.json();
    setProjects(prev =>
      prev.map(project => (project.id === id ? updatedProject : project))
    );
    return updatedProject;
  };

  const deleteProject = async (id) => {
    const response = await fetch(`http://localhost:3001/projects/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error('Failed to delete project');
    }
    setProjects(prev => prev.filter(project => project.id !== id));
  };

  const value = {
    projects,
    loading,
    error,
    addProject,
    updateProject,
    deleteProject
  };

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
};
