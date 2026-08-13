import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { candidateService } from '../services/candidateService';
import { reportService } from '../services/reportService';
import { useAuth } from './AuthContext';

const CandidateContext = createContext();

export const CandidateProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [metrics, setMetrics] = useState({
    totalCandidates: 0,
    shortlistedCount: 0,
    interviewCount: 0,
    selectedCount: 0,
    rejectedCount: 0,
    appliedCount: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchCandidateData = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    setIsError(false);
    try {
      const [candRes, metricRes] = await Promise.all([
        candidateService.getCandidates({ limit: 100 }),
        reportService.getDashboardMetrics()
      ]);

      if (candRes.success) {
        setCandidates(candRes.data || []);
      }
      if (metricRes.success && metricRes.data) {
        setMetrics(metricRes.data.metrics || {});
      }
    } catch (err) {
      console.error('Failed to load candidates:', err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCandidateData();
    const handleGlobalCandidateSubmit = () => {
      fetchCandidateData();
    };
    window.addEventListener('candidateSubmitted', handleGlobalCandidateSubmit);
    return () => window.removeEventListener('candidateSubmitted', handleGlobalCandidateSubmit);
  }, [fetchCandidateData]);

  const addCandidate = async (formData) => {
    const res = await candidateService.createCandidate(formData);
    if (res.success) {
      await fetchCandidateData();
    }
    return res;
  };

  const shortlistCandidate = async (id, remarks) => {
    const res = await candidateService.shortlistCandidate(id, remarks);
    if (res.success) {
      await fetchCandidateData();
    }
    return res;
  };

  const rejectCandidate = async (id, reason) => {
    const res = await candidateService.rejectCandidate(id, reason);
    if (res.success) {
      await fetchCandidateData();
    }
    return res;
  };

  return (
    <CandidateContext.Provider value={{
      candidates,
      metrics,
      isLoading,
      isError,
      setIsError,
      refreshCandidates: fetchCandidateData,
      addCandidate,
      shortlistCandidate,
      rejectCandidate
    }}>
      {children}
    </CandidateContext.Provider>
  );
};

export const useCandidates = () => {
  const context = useContext(CandidateContext);
  if (!context) throw new Error('useCandidates must be used within a CandidateProvider');
  return context;
};
