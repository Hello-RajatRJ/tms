import { useState, useEffect, useCallback } from 'react';
import { teamMemberService } from '../services/api';

export const useTeamMembers = (initialFilters = {}) => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await teamMemberService.getAll(filters);
      setTeamMembers(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch team members');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const addMember = async (data) => {
    const res = await teamMemberService.create(data);
    setTeamMembers((prev) => [res.data, ...prev]);
    return res.data;
  };

  const updateMember = async (id, data) => {
    const res = await teamMemberService.update(id, data);
    setTeamMembers((prev) => prev.map((m) => (m._id === id ? res.data : m)));
    return res.data;
  };

  const removeMember = async (id) => {
    await teamMemberService.delete(id);
    setTeamMembers((prev) => prev.filter((m) => m._id !== id));
  };

  return {
    teamMembers,
    loading,
    error,
    filters,
    setFilters,
    refetch: fetchMembers,
    addMember,
    updateMember,
    removeMember,
  };
};
