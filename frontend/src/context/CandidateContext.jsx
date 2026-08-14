import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { candidateService } from '../services/candidateService';
import { reportService } from '../services/reportService';
import { INITIAL_CANDIDATES } from '../data/mockCandidates';
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

  const getLocalRegisteredCandidates = () => {
    try {
      const saved = localStorage.getItem('registered_candidates');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  };

  const getDeletedCandidateEntries = () => {
    try {
      const saved = localStorage.getItem('deleted_candidate_ids');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  };

  const isCandidateDeleted = (c, deletedList) => {
    if (!c || !deletedList || deletedList.length === 0) return false;
    const cid = String(c._id || c.id || c.candidateId || c.applicationId || '').toLowerCase();
    const cemail = (c.email || '').toLowerCase();
    const crole = (c.role || '').toLowerCase();

    return deletedList.some(d => {
      if (!d) return false;
      if (typeof d === 'string') {
        const strD = d.toLowerCase();
        return cid && (cid === strD || strD === cid);
      }
      if (typeof d === 'object') {
        const dId = String(d.id || d._id || '').toLowerCase();
        const dEmail = (d.email || '').toLowerCase();
        const dRole = (d.role || '').toLowerCase();

        if (dId && cid && (cid === dId || dId === cid)) return true;
        if (dEmail && cemail && dEmail === cemail) {
          if (dRole && crole && dRole === crole) return true;
        }
      }
      return false;
    });
  };

  const fetchCandidateData = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    setIsError(false);

    const localCands = getLocalRegisteredCandidates();
    const deletedList = getDeletedCandidateEntries();

    try {
      const [candRes, metricRes] = await Promise.all([
        candidateService.getCandidates({ limit: 100 }).catch(() => null),
        reportService.getDashboardMetrics().catch(() => null)
      ]);

      let apiCands = (candRes && candRes.success && candRes.data) ? candRes.data : [];

      let combined = [];
      if (apiCands.length === 0) {
        combined = [...localCands];
        INITIAL_CANDIDATES.forEach(mc => {
          const mcEmail = (mc.email || '').toLowerCase();
          const mcRole = (mc.role || '').toLowerCase();
          if (!combined.some(c => (c.id && c.id === mc.id) || (c.email && mc.email && c.email.toLowerCase() === mcEmail && (c.role || '').toLowerCase() === mcRole))) {
            combined.push(mc);
          }
        });
      } else {
        combined = [...apiCands];
        localCands.forEach(lc => {
          const lcId = String(lc._id || lc.id || '');
          const lcEmail = (lc.email || '').toLowerCase();
          const lcRole = (lc.role || '').toLowerCase();
          if (!combined.some(c => (c._id && String(c._id) === lcId) || (c.id && String(c.id) === lcId) || (c.email && lcEmail && c.email.toLowerCase() === lcEmail && (c.role || '').toLowerCase() === lcRole))) {
            combined.push(lc);
          }
        });
      }

      const activeCandidates = combined.filter(c => !isCandidateDeleted(c, deletedList));
      setCandidates(activeCandidates);

      if (metricRes && metricRes.success && metricRes.data) {
        setMetrics(metricRes.data.metrics || {});
      }
    } catch (err) {
      console.error('Failed to load candidates:', err);
      const combined = [...localCands];
      INITIAL_CANDIDATES.forEach(mc => {
        if (!combined.some(c => c.id === mc.id || c.email === mc.email)) {
          combined.push(mc);
        }
      });
      const activeCandidates = combined.filter(c => !isCandidateDeleted(c, deletedList));
      setCandidates(activeCandidates);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const computedMetrics = useMemo(() => {
    const totalCandidates = candidates.length;
    let shortlistedCount = 0;
    let interviewCount = 0;
    let selectedCount = 0;
    let rejectedCount = 0;
    let appliedCount = 0;

    candidates.forEach(c => {
      const st = String(c.stage || c.status || 'New').toLowerCase();
      if (st.includes('shortlist')) {
        shortlistedCount++;
      } else if (st.includes('interview')) {
        interviewCount++;
      } else if (st.includes('select') || st.includes('offer') || st.includes('hired')) {
        selectedCount++;
      } else if (st.includes('reject')) {
        rejectedCount++;
      } else {
        appliedCount++;
      }
    });

    return {
      totalCandidates,
      shortlistedCount,
      interviewCount,
      selectedCount,
      rejectedCount,
      appliedCount,
      newCount: appliedCount,
      shortlistedRatio: totalCandidates > 0 ? Number(((shortlistedCount / totalCandidates) * 100).toFixed(0)) : 0,
      interviewRatio: totalCandidates > 0 ? Number(((interviewCount / totalCandidates) * 100).toFixed(0)) : 0,
      selectedRatio: totalCandidates > 0 ? Number(((selectedCount / totalCandidates) * 100).toFixed(0)) : 0,
    };
  }, [candidates]);

  useEffect(() => {
    fetchCandidateData();
    const handleGlobalCandidateSubmit = () => {
      fetchCandidateData();
    };
    window.addEventListener('candidateSubmitted', handleGlobalCandidateSubmit);
    return () => window.removeEventListener('candidateSubmitted', handleGlobalCandidateSubmit);
  }, [fetchCandidateData]);

  const getCandidateById = useCallback((id) => {
    if (!id) return null;
    const target = String(id).toLowerCase();
    return (candidates || []).find(c => 
      String(c._id || '').toLowerCase() === target || 
      String(c.id || '').toLowerCase() === target || 
      String(c.candidateId || '').toLowerCase() === target
    ) || null;
  }, [candidates]);

  const addCandidate = async (formData) => {
    const res = await candidateService.createCandidate(formData).catch(() => null);
    await fetchCandidateData();
    return res || { success: true };
  };

  const isMatchCandidate = (c, targetId) => {
    if (!c || !targetId) return false;
    const tid = String(targetId).toLowerCase();
    const cid = String(c._id || c.id || c.candidateId || c.applicationId || '').toLowerCase();
    const emailLower = (c.email || '').toLowerCase();

    if (cid && (cid === tid || tid.includes(cid) || cid.includes(tid))) return true;
    if (emailLower && tid === emailLower) return true;
    return false;
  };

  const deleteCandidate = async (id) => {
    try {
      const targetCand = (candidates || []).find(c => isMatchCandidate(c, id));
      const candIdStr = String(id || targetCand?._id || targetCand?.id || '');
      const candEmailStr = (targetCand?.email || '').toLowerCase();
      const candRoleStr = (targetCand?.role || '').toLowerCase();

      try {
        const deleted = getDeletedCandidateEntries();
        deleted.push({
          id: candIdStr,
          _id: targetCand?._id || targetCand?.id || id,
          email: candEmailStr,
          role: candRoleStr
        });
        localStorage.setItem('deleted_candidate_ids', JSON.stringify(deleted));
      } catch (e) {}

      if (id && typeof id === 'string' && !id.startsWith('synthetic') && !id.startsWith('cand-')) {
        await candidateService.deleteCandidate(id).catch(() => null);
      }

      try {
        const saved = JSON.parse(localStorage.getItem('registered_candidates') || '[]');
        const updated = saved.filter(c => !isMatchCandidate(c, id));
        localStorage.setItem('registered_candidates', JSON.stringify(updated));
      } catch (e) {}

      setCandidates(prev => prev.filter(c => !isMatchCandidate(c, id)));

      window.dispatchEvent(new CustomEvent('candidateSubmitted'));
    } catch (err) {
      console.error('deleteCandidate error:', err);
    }
  };

  const shortlistCandidate = async (id, remarks) => {
    const res = await candidateService.shortlistCandidate(id, remarks).catch(() => null);
    try {
      const saved = JSON.parse(localStorage.getItem('registered_candidates') || '[]');
      const updated = saved.map(c => {
        if (isMatchCandidate(c, id)) {
          return { ...c, status: 'Shortlisted', stage: 'Shortlisted', isHrUpdated: true };
        }
        return c;
      });
      localStorage.setItem('registered_candidates', JSON.stringify(updated));
    } catch (e) {}
    setCandidates(prev => prev.map(c => isMatchCandidate(c, id) ? { ...c, status: 'Shortlisted', stage: 'Shortlisted', isHrUpdated: true } : c));
    await fetchCandidateData();
    window.dispatchEvent(new CustomEvent('candidateSubmitted'));
    return res || { success: true };
  };

  const scheduleInterview = async (id, data) => {
    try {
      await candidateService.updateCandidate(id, { ...data, status: 'Interview' }).catch(() => null);
      try {
        const saved = JSON.parse(localStorage.getItem('registered_candidates') || '[]');
        const updated = saved.map(c => {
          if (isMatchCandidate(c, id)) {
            return { ...c, status: 'Interview', stage: 'Interview', isHrUpdated: true, interview: data };
          }
          return c;
        });
        localStorage.setItem('registered_candidates', JSON.stringify(updated));
      } catch (e) {}
      setCandidates(prev => prev.map(c => isMatchCandidate(c, id) ? { ...c, status: 'Interview', stage: 'Interview', isHrUpdated: true, interview: data } : c));
      await fetchCandidateData();
      window.dispatchEvent(new CustomEvent('candidateSubmitted'));
    } catch (err) {
      console.error(err);
    }
  };

  const selectCandidate = async (id, remarks = '') => {
    try {
      await candidateService.updateCandidate(id, { status: 'Selected', remarks }).catch(() => null);
      try {
        const saved = JSON.parse(localStorage.getItem('registered_candidates') || '[]');
        const updated = saved.map(c => {
          if (isMatchCandidate(c, id)) {
            return { ...c, status: 'Selected', stage: 'Selected', isHrUpdated: true };
          }
          return c;
        });
        localStorage.setItem('registered_candidates', JSON.stringify(updated));
      } catch (e) {}
      setCandidates(prev => prev.map(c => isMatchCandidate(c, id) ? { ...c, status: 'Selected', stage: 'Selected', isHrUpdated: true } : c));
      await fetchCandidateData();
      window.dispatchEvent(new CustomEvent('candidateSubmitted'));
    } catch (err) {
      console.error(err);
    }
  };

  const rejectCandidate = async (id, reason) => {
    const res = await candidateService.rejectCandidate(id, reason).catch(() => null);
    try {
      const saved = JSON.parse(localStorage.getItem('registered_candidates') || '[]');
      const updated = saved.map(c => {
        if (isMatchCandidate(c, id)) {
          return { ...c, status: 'Rejected', stage: 'Rejected', isHrUpdated: true };
        }
        return c;
      });
      localStorage.setItem('registered_candidates', JSON.stringify(updated));
    } catch (e) {}
    setCandidates(prev => prev.map(c => isMatchCandidate(c, id) ? { ...c, status: 'Rejected', stage: 'Rejected', isHrUpdated: true } : c));
    await fetchCandidateData();
    window.dispatchEvent(new CustomEvent('candidateSubmitted'));
    return res || { success: true };
  };

  return (
    <CandidateContext.Provider value={{
      candidates,
      metrics: computedMetrics,
      isLoading,
      isError,
      setIsError,
      refreshCandidates: fetchCandidateData,
      getCandidateById,
      addCandidate,
      deleteCandidate,
      shortlistCandidate,
      scheduleInterview,
      selectCandidate,
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
