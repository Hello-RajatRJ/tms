import { useState, useEffect, useCallback } from 'react';
import { projectService } from '../services/api';

export const useProjects = (initialFilters = {}) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await projectService.getAll(filters);
      setProjects(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const addProject = async (data) => {
    const res = await projectService.create(data);
    setProjects((prev) => [res.data, ...prev]);
    return res.data;
  };

  const updateProject = async (id, data) => {
    const res = await projectService.update(id, data);
    setProjects((prev) => prev.map((p) => (p._id === id ? res.data : p)));
    return res.data;
  };

  const removeProject = async (id) => {
    await projectService.delete(id);
    setProjects((prev) => prev.filter((p) => p._id !== id));
  };

  return {
    projects,
    loading,
    error,
    filters,
    setFilters,
    refetch: fetchProjects,
    addProject,
    updateProject,
    removeProject,
  };
};
