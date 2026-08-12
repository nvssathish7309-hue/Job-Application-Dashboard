import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { INITIAL_CANDIDATES } from '../data/mockCandidates';

const CandidateContext = createContext(null);

const LOCAL_STORAGE_KEY = 'mindmatrix_candidates_v2';
const HR_PROFILE_STORAGE_KEY = 'mindmatrix_hr_profile_v1';

const DEFAULT_HR_PROFILE = {
  name: 'Ankita Kumar',
  email: 'ankita.kumar@mindmatrix.com',
  phone: '+91 98765 43210',
  title: 'Lead HR Recruiter',
  department: 'Talent Acquisition'
};

export function CandidateProvider({ children }) {
  const [candidates, setCandidates] = useState(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Failed to load candidates from localStorage", e);
    }
    return INITIAL_CANDIDATES;
  });

  const [hrProfile, setHrProfile] = useState(() => {
    try {
      const stored = localStorage.getItem(HR_PROFILE_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Failed to load HR profile from localStorage", e);
    }
    return DEFAULT_HR_PROFILE;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // Sync candidates to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(candidates));
    } catch (e) {
      console.error("Failed to save candidates to localStorage", e);
    }
  }, [candidates]);

  // Sync hrProfile to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(HR_PROFILE_STORAGE_KEY, JSON.stringify(hrProfile));
    } catch (e) {
      console.error("Failed to save HR profile to localStorage", e);
    }
  }, [hrProfile]);

  const updateHrProfile = (newProfile) => {
    setHrProfile(prev => ({ ...prev, ...newProfile }));
  };

  const hrInitials = useMemo(() => {
    if (!hrProfile?.name) return 'HR';
    const parts = hrProfile.name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }, [hrProfile?.name]);

  // Derived Metric Counts
  const metrics = useMemo(() => {
    const total = candidates.length;
    let shortlisted = 0;
    let interview = 0;
    let selected = 0;
    let rejected = 0;
    let newCount = 0;

    candidates.forEach(c => {
      const s = (c.status || '').toLowerCase();
      if (s.includes('shortlist')) shortlisted++;
      else if (s.includes('interview')) interview++;
      else if (s.includes('select')) selected++;
      else if (s.includes('reject')) rejected++;
      else newCount++;
    });

    return {
      totalCandidates: total,
      shortlistedCount: shortlisted,
      interviewCount: interview,
      selectedCount: selected,
      rejectedCount: rejected,
      newCount: newCount
    };
  }, [candidates]);

  // Action Handlers
  const addCandidate = (newCandData) => {
    const newCandidate = {
      id: `cand-${Date.now().toString().slice(-5)}`,
      status: 'New',
      appliedDate: new Date().toISOString().split('T')[0],
      location: 'Remote / Hybrid',
      projects: newCandData.projects || [],
      education: typeof newCandData.education === 'string' ? {
        degree: newCandData.education,
        institution: 'University / Institute',
        year: '2026',
        gpa: 'N/A'
      } : newCandData.education,
      resume: {
        fileName: newCandData.resumeFileName || `${newCandData.name.replace(/\s+/g, '_')}_Resume.pdf`,
        fileSize: '1.8 MB',
        uploadedAt: new Date().toISOString().split('T')[0],
        previewText: `Uploaded resume for ${newCandData.name}. Specialized in ${newCandData.role}.`
      },
      interviewFeedback: [],
      interview: {
        status: "Not Scheduled",
        date: null,
        round: null,
        interviewer: null
      },
      ...newCandData
    };

    setCandidates(prev => [newCandidate, ...prev]);
    return newCandidate;
  };

  const updateCandidateStatus = (candidateId, newStatus) => {
    setCandidates(prev =>
      prev.map(c => c.id === candidateId ? { ...c, status: newStatus } : c)
    );
  };

  const scheduleInterview = (candidateId, interviewData) => {
    setCandidates(prev =>
      prev.map(c => {
        if (c.id !== candidateId) return c;
        return {
          ...c,
          status: 'Interview Scheduled',
          interview: {
            status: 'Scheduled',
            date: `${interviewData.date} ${interviewData.time}`,
            round: interviewData.round,
            interviewer: interviewData.interviewer,
            meetingLink: interviewData.meetingLink,
            notes: interviewData.notes
          }
        };
      })
    );
  };

  const shortlistCandidate = (candidateId) => {
    updateCandidateStatus(candidateId, 'Shortlisted');
  };

  const selectCandidate = (candidateId) => {
    updateCandidateStatus(candidateId, 'Selected');
  };

  const rejectCandidate = (candidateId, reason = '') => {
    setCandidates(prev =>
      prev.map(c => {
        if (c.id !== candidateId) return c;
        return {
          ...c,
          status: 'Rejected',
          rejectionReason: reason
        };
      })
    );
  };

  const getCandidateById = (id) => {
    return candidates.find(c => c.id === id) || null;
  };

  const resetToDefaultData = () => {
    setCandidates(INITIAL_CANDIDATES);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  return (
    <CandidateContext.Provider
      value={{
        candidates,
        metrics,
        hrProfile,
        updateHrProfile,
        hrInitials,
        isLoading,
        setIsLoading,
        isError,
        setIsError,
        addCandidate,
        updateCandidateStatus,
        scheduleInterview,
        shortlistCandidate,
        selectCandidate,
        rejectCandidate,
        getCandidateById,
        resetToDefaultData
      }}
    >
      {children}
    </CandidateContext.Provider>
  );
}

export function useCandidates() {
  const context = useContext(CandidateContext);
  if (!context) {
    throw new Error('useCandidates must be used within a CandidateProvider');
  }
  return context;
}
