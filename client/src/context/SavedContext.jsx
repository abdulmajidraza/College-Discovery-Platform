import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const SavedContext = createContext();

export function SavedProvider({ children }) {
  const { user } = useAuth();
  const [savedIds, setSavedIds] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setLoading(true);
      fetch('/api/saved', { credentials: 'include' })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setSavedIds(data.map(c => c._id || c.id));
          }
        })
        .catch(err => console.error('Error fetching saved:', err))
        .finally(() => setLoading(false));
    } else {
      const local = JSON.parse(localStorage.getItem('savedColleges') || '[]');
      setSavedIds(local);
      setLoading(false);
    }
  }, [user]);

  const toggleSave = async (collegeId) => {
    const isSaved = savedIds.includes(collegeId);

    if (user) {
      const method = isSaved ? 'DELETE' : 'POST';
      const res = await fetch('/api/saved', {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collegeId })
      });
      if (res.ok) {
        if (isSaved) {
          setSavedIds(prev => prev.filter(id => id !== collegeId));
        } else {
          setSavedIds(prev => [...prev, collegeId]);
        }
        return !isSaved;
      }
      throw new Error('Failed to update saved list');
    } else {
      const local = JSON.parse(localStorage.getItem('savedColleges') || '[]');
      let next;
      if (isSaved) {
        next = local.filter(id => id !== collegeId);
      } else {
        next = [...new Set([...local, collegeId])];
      }
      localStorage.setItem('savedColleges', JSON.stringify(next));
      setSavedIds(next);
      return !isSaved;
    }
  };

  return (
    <SavedContext.Provider value={{ savedIds, toggleSave, loading }}>
      {children}
    </SavedContext.Provider>
  );
}

export function useSaved() {
  return useContext(SavedContext);
}
