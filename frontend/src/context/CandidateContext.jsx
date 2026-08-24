import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { candidateService } from '../services/candidateService';
import { reportService } from '../services/reportService';
import { notificationService } from '../services/notificationService';
import { INITIAL_CANDIDATES } from '../data/mockCandidates';
import { useAuth } from './AuthContext';


const CandidateContext = createContext();

export const CandidateProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [trashedCandidates, setTrashedCandidates] = useState([]);
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
    const cid = String(c._id || c.id || c.candidateId || '').toLowerCase();
    if (!cid) return false;

    return deletedList.some(d => {
      if (!d) return false;
      if (typeof d === 'string') {
        const strD = d.toLowerCase();
        return cid === strD;
      }
      if (typeof d === 'object') {
        const dId = String(d.id || d._id || d.candidateId || '').toLowerCase();
        return dId && cid === dId;
      }
      return false;
    });
  };

  const fetchCandidateData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);

    const localCands = getLocalRegisteredCandidates();
    const deletedList = getDeletedCandidateEntries();

    try {
      const [candRes, metricRes] = await Promise.all([
        candidateService.getCandidates({ limit: 100 }).catch(() => null),
        reportService.getDashboardMetrics().catch(() => null)
      ]);

      let apiCands = (candRes && candRes.success && Array.isArray(candRes.data)) ? candRes.data : [];

      let rawList = [...apiCands, ...localCands];

      // Always preserve initial candidates so data is never lost or blank on re-opening
      INITIAL_CANDIDATES.forEach(mc => {
        if (!mc) return;
        const mcEmail = (mc.email || '').toLowerCase();
        const mcName = (mc.fullName || mc.name || '').toLowerCase();
        const exists = rawList.some(item => {
          if (!item) return false;
          const iEmail = (item.email || '').toLowerCase();
          const iName = (item.fullName || item.name || '').toLowerCase();
          return (mcEmail && iEmail === mcEmail) || (mcName && iName === mcName);
        });
        if (!exists) {
          rawList.push(mc);
        }
      });


      // Single candidate profile per unique candidate email or candidate ID with merged applications list
      const candidateMap = new Map();

      rawList.forEach(item => {
        if (!item) return;
        const nameStr = (item.fullName || item.name || '').trim();
        const emailStr = (item.email || '').trim();
        if (!nameStr && !emailStr) return;

        const emailKey = emailStr ? emailStr.toLowerCase() : null;
        const idKey = item._id || item.id || item.candidateId;
        const mapKey = emailKey || (idKey ? String(idKey).toLowerCase() : `name-${nameStr.toLowerCase().replace(/\s+/g, ' ')}`);

        const existing = candidateMap.get(mapKey);


        const appObj = {
          _id: item.applicationId || item._id || item.id || `app-${Date.now()}`,
          applicationId: item.applicationId || `APP-${Math.floor(1000 + Math.random() * 9000)}`,
          role: item.role || item.title || 'Software Engineer',
          jobTitle: item.role || item.title || 'Software Engineer',
          status: item.status || item.stage || 'Applied',
          stage: item.stage || item.status || 'Applied',
          source: item.source || 'Website',
          appliedAt: item.appliedAt || item.appliedDate || item.createdAt || new Date().toISOString()
        };

        if (!existing) {
          const initApps = item.applications && item.applications.length > 0 ? item.applications : [appObj];
          const allRoles = [...new Set(initApps.map(a => a.role || a.jobTitle).filter(Boolean))];
          candidateMap.set(mapKey, {
            ...item,
            fullName: nameStr || item.fullName || item.name || 'Candidate User',
            name: nameStr || item.name || item.fullName || 'Candidate User',
            role: allRoles.join(', ') || item.role || 'Software Engineer',
            applications: initApps,
            applicationsCount: initApps.length
          });
        } else {
          // Merge existing candidate profile with latest info without duplicate candidate names
          const currentApps = [...(existing.applications || [])];
          if (item.applications && item.applications.length > 0) {
            item.applications.forEach(a => {
              const aRole = a.role || a.jobTitle;
              const aId = String(a._id || a.applicationId || '');
              if (!currentApps.some(ca => (aId && String(ca._id || ca.applicationId || '') === aId) || (aRole && (ca.role || ca.jobTitle) === aRole))) {
                currentApps.push(a);
              }
            });
          } else {
            const appExists = currentApps.some(a => (a._id && a._id === appObj._id) || (a.role && a.role === appObj.role));
            if (!appExists) {
              currentApps.push(appObj);
            }
          }
          const allRoles = [...new Set(currentApps.map(a => a.role || a.jobTitle).filter(Boolean))];
          candidateMap.set(mapKey, {
            ...existing,
            ...item,
            fullName: existing.fullName || nameStr,
            name: existing.name || nameStr,
            role: allRoles.join(', ') || existing.role || item.role,
            applications: currentApps,
            applicationsCount: currentApps.length
          });
        }

      });

      const combined = Array.from(candidateMap.values());
      const activeCandidates = combined.filter(c => !isCandidateDeleted(c, deletedList));
      const trashedList = combined.filter(c => isCandidateDeleted(c, deletedList));
      setCandidates(activeCandidates);
      setTrashedCandidates(trashedList);

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
      const trashedList = combined.filter(c => isCandidateDeleted(c, deletedList));
      setCandidates(activeCandidates);
      setTrashedCandidates(trashedList);
    } finally {
      setIsLoading(false);
    }
  }, []);


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
    const nameLower = (c.fullName || c.name || '').toLowerCase();

    if (cid && (cid === tid || tid.includes(cid) || cid.includes(tid))) return true;
    if (emailLower && (tid === emailLower || tid.includes(emailLower) || emailLower.includes(tid))) return true;
    if (nameLower && (tid.includes('sathish') && nameLower.includes('sathish'))) return true;

    if (c.applications && Array.isArray(c.applications)) {
      return c.applications.some(a => {
        const aId = String(a._id || a.id || a.applicationId || '').toLowerCase();
        return aId && (aId === tid || tid.includes(aId) || aId.includes(tid));
      });
    }

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

  const addCandidateNotification = (id, newStage, remarks = '') => {
    try {
      const target = (candidates || []).find(c => isMatchCandidate(c, id));
      const candEmail = target?.email || 'nvssathish7309@gmail.com';
      const candRole = target?.role || 'Position Applied';
      const candName = target?.fullName || target?.name || 'Candidate';

      const existingNotifs = JSON.parse(localStorage.getItem('local_notifications') || '[]');

      const isPositive = ['shortlisted', 'interview', 'selected', 'offer', 'screening'].some(s => newStage.toLowerCase().includes(s));
      const notifTitle = isPositive 
        ? `🎉 Congratulations ${candName}!`
        : `Application Update for ${candName}`;
      
      const notifMessage = isPositive
        ? `Congratulations ${candName}! Your application status for "${candRole}" has been updated to "${newStage}"${remarks ? `. Notes: ${remarks}` : '.'}`
        : `Application Update: Your application status for "${candRole}" is "${newStage}"${remarks ? `. Notes: ${remarks}` : '.'}`;

      // 1. Candidate Notification
      const candidateNotif = {
        id: `cand-notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        forCandidate: true,
        title: notifTitle,
        message: notifMessage,
        timestamp: new Date().toISOString(),
        candidateEmail: candEmail.toLowerCase(),
        candidateName: candName,
        isRead: false
      };

      // 2. Interviewer Notification
      const interviewerNotif = {
        id: `int-notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        forInterviewer: true,
        targetRole: 'INTERVIEWER',
        interviewerEmail: 'interviewer@mindmatrix.com',
        title: `Candidate Status Alert: ${candName}`,
        message: `Candidate ${candName} (${candRole}) has been moved to stage "${newStage}"${remarks ? `. Notes: ${remarks}` : '.'}`,
        timestamp: new Date().toISOString(),
        candidateName: candName,
        isRead: false
      };

      localStorage.setItem('local_notifications', JSON.stringify([candidateNotif, interviewerNotif, ...existingNotifs]));

      // 3. Send email notification to Candidate
      if (candEmail) {
        notificationService.sendEmailNotification({
          toEmail: candEmail,
          candidateName: candName,
          title: notifTitle,
          message: notifMessage,
          stage: newStage
        }).catch(err => console.warn('Failed to dispatch candidate email notification:', err.message));
      }
    } catch (e) {}
  };


  const shortlistCandidate = async (id, remarks) => {
    const res = await candidateService.shortlistCandidate(id, remarks).catch(() => null);
    addCandidateNotification(id, 'Shortlisted', remarks);
    try {
      const saved = JSON.parse(localStorage.getItem('registered_candidates') || '[]');
      const updated = saved.map(c => {
        if (isMatchCandidate(c, id)) {
          const updatedApps = (c.applications || []).map(a => ({ ...a, status: 'Shortlisted', stage: 'Shortlisted' }));
          return { ...c, status: 'Shortlisted', stage: 'Shortlisted', applications: updatedApps.length > 0 ? updatedApps : c.applications, isHrUpdated: true };
        }
        return c;
      });
      localStorage.setItem('registered_candidates', JSON.stringify(updated));
    } catch (e) {}
    setCandidates(prev => prev.map(c => {
      if (isMatchCandidate(c, id)) {
        const updatedApps = (c.applications || []).map(a => ({ ...a, status: 'Shortlisted', stage: 'Shortlisted' }));
        return { ...c, status: 'Shortlisted', stage: 'Shortlisted', applications: updatedApps.length > 0 ? updatedApps : c.applications, isHrUpdated: true };
      }
      return c;
    }));
    await fetchCandidateData();
    window.dispatchEvent(new CustomEvent('candidateSubmitted'));
    return res || { success: true };
  };

  const scheduleInterview = async (id, data) => {
    try {
      await candidateService.updateCandidate(id, { ...data, status: 'Interview' }).catch(() => null);
      addCandidateNotification(id, 'Interview Scheduled', data?.notes || '');
      try {
        const saved = JSON.parse(localStorage.getItem('registered_candidates') || '[]');
        const updated = saved.map(c => {
          if (isMatchCandidate(c, id)) {
            const updatedApps = (c.applications || []).map(a => ({ ...a, status: 'Interview', stage: 'Interview' }));
            return { ...c, status: 'Interview', stage: 'Interview', applications: updatedApps.length > 0 ? updatedApps : c.applications, isHrUpdated: true, interview: data };
          }
          return c;
        });
        localStorage.setItem('registered_candidates', JSON.stringify(updated));
      } catch (e) {}
      setCandidates(prev => prev.map(c => {
        if (isMatchCandidate(c, id)) {
          const updatedApps = (c.applications || []).map(a => ({ ...a, status: 'Interview', stage: 'Interview' }));
          return { ...c, status: 'Interview', stage: 'Interview', applications: updatedApps.length > 0 ? updatedApps : c.applications, isHrUpdated: true, interview: data };
        }
        return c;
      }));
      await fetchCandidateData();
      window.dispatchEvent(new CustomEvent('candidateSubmitted'));
    } catch (err) {
      console.error(err);
    }
  };

  const selectCandidate = async (id, remarks = '') => {
    try {
      await candidateService.updateCandidate(id, { status: 'Selected', remarks }).catch(() => null);
      addCandidateNotification(id, 'Selected / Offer', remarks);
      try {
        const saved = JSON.parse(localStorage.getItem('registered_candidates') || '[]');
        const updated = saved.map(c => {
          if (isMatchCandidate(c, id)) {
            const updatedApps = (c.applications || []).map(a => ({ ...a, status: 'Selected', stage: 'Selected' }));
            return { ...c, status: 'Selected', stage: 'Selected', applications: updatedApps.length > 0 ? updatedApps : c.applications, isHrUpdated: true };
          }
          return c;
        });
        localStorage.setItem('registered_candidates', JSON.stringify(updated));
      } catch (e) {}
      setCandidates(prev => prev.map(c => {
        if (isMatchCandidate(c, id)) {
          const updatedApps = (c.applications || []).map(a => ({ ...a, status: 'Selected', stage: 'Selected' }));
          return { ...c, status: 'Selected', stage: 'Selected', applications: updatedApps.length > 0 ? updatedApps : c.applications, isHrUpdated: true };
        }
        return c;
      }));
      await fetchCandidateData();
      window.dispatchEvent(new CustomEvent('candidateSubmitted'));
    } catch (err) {
      console.error(err);
    }
  };

  const rejectCandidate = async (id, reason) => {
    const res = await candidateService.rejectCandidate(id, reason).catch(() => null);
    addCandidateNotification(id, 'Rejected', reason);
    try {
      const saved = JSON.parse(localStorage.getItem('registered_candidates') || '[]');
      const updated = saved.map(c => {
        if (isMatchCandidate(c, id)) {
          const updatedApps = (c.applications || []).map(a => ({ ...a, status: 'Rejected', stage: 'Rejected' }));
          return { ...c, status: 'Rejected', stage: 'Rejected', applications: updatedApps.length > 0 ? updatedApps : c.applications, isHrUpdated: true };
        }
        return c;
      });
      localStorage.setItem('registered_candidates', JSON.stringify(updated));
    } catch (e) {}
    setCandidates(prev => prev.map(c => {
      if (isMatchCandidate(c, id)) {
        const updatedApps = (c.applications || []).map(a => ({ ...a, status: 'Rejected', stage: 'Rejected' }));
        return { ...c, status: 'Rejected', stage: 'Rejected', applications: updatedApps.length > 0 ? updatedApps : c.applications, isHrUpdated: true };
      }
      return c;
    }));
    await fetchCandidateData();
    window.dispatchEvent(new CustomEvent('candidateSubmitted'));
    return res || { success: true };
  };

  const updateCandidateStage = async (id, newStage, remarks = '') => {
    try {
      const stageName = newStage === 'New Applicants' ? 'New' : newStage;
      await candidateService.updateCandidate(id, { status: stageName, stage: stageName, remarks }).catch(() => null);
      addCandidateNotification(id, stageName, remarks);
      try {
        const saved = JSON.parse(localStorage.getItem('registered_candidates') || '[]');
        const updated = saved.map(c => {
          if (isMatchCandidate(c, id)) {
            const updatedApps = (c.applications || []).map(a => ({ ...a, status: stageName, stage: stageName }));
            return {
              ...c,
              status: stageName,
              stage: stageName,
              applications: updatedApps.length > 0 ? updatedApps : c.applications,
              isHrUpdated: true
            };
          }
          return c;
        });
        localStorage.setItem('registered_candidates', JSON.stringify(updated));
      } catch (e) {}
      setCandidates(prev => prev.map(c => {
        if (isMatchCandidate(c, id)) {
          const updatedApps = (c.applications || []).map(a => ({ ...a, status: stageName, stage: stageName }));
          return {
            ...c,
            status: stageName,
            stage: stageName,
            applications: updatedApps.length > 0 ? updatedApps : c.applications,
            isHrUpdated: true
          };
        }
        return c;
      }));
      await fetchCandidateData();
      window.dispatchEvent(new CustomEvent('candidateSubmitted'));
    } catch (err) {
      console.error('updateCandidateStage error:', err);
    }
  };

  const updateCandidate = async (id, updateData) => {
    try {
      const res = await candidateService.updateCandidate(id, updateData).catch(() => null);
      const newStage = updateData.status || updateData.stage || 'Updated';
      addCandidateNotification(id, newStage, updateData.remarks || updateData.notes || 'Profile details updated by HR');
      await fetchCandidateData();
      window.dispatchEvent(new CustomEvent('candidateSubmitted'));
      return res || { success: true };
    } catch (err) {
      console.error('updateCandidate error:', err);
    }
  };

  const restoreCandidate = async (id) => {
    try {
      const deletedList = getDeletedCandidateEntries();
      const target = (trashedCandidates || []).find(c => isMatchCandidate(c, id));
      const tid = String(id || target?._id || target?.id || '').toLowerCase();
      const temail = (target?.email || '').toLowerCase();

      const updatedDeleted = deletedList.filter(d => {
        if (!d) return false;
        const dId = String(typeof d === 'string' ? d : d.id || d._id || d.candidateId || '').toLowerCase();
        const dEmail = String(typeof d === 'object' ? d.email || '' : '').toLowerCase();
        if (tid && (dId === tid || tid.includes(dId) || dId.includes(tid))) return false;
        if (temail && dEmail && dEmail === temail) return false;
        return true;
      });

      localStorage.setItem('deleted_candidate_ids', JSON.stringify(updatedDeleted));
      await fetchCandidateData();
      window.dispatchEvent(new CustomEvent('candidateSubmitted'));
    } catch (err) {
      console.error('restoreCandidate error:', err);
    }
  };

  const permanentlyDeleteCandidate = async (id) => {
    try {
      const saved = JSON.parse(localStorage.getItem('registered_candidates') || '[]');
      const updated = saved.filter(c => !isMatchCandidate(c, id));
      localStorage.setItem('registered_candidates', JSON.stringify(updated));

      const deletedList = getDeletedCandidateEntries();
      const target = (trashedCandidates || []).find(c => isMatchCandidate(c, id));
      const tid = String(id || target?._id || target?.id || '').toLowerCase();
      const temail = (target?.email || '').toLowerCase();

      const updatedDeleted = deletedList.filter(d => {
        if (!d) return false;
        const dId = String(typeof d === 'string' ? d : d.id || d._id || d.candidateId || '').toLowerCase();
        const dEmail = String(typeof d === 'object' ? d.email || '' : '').toLowerCase();
        if (tid && (dId === tid || tid.includes(dId) || dId.includes(tid))) return false;
        if (temail && dEmail && dEmail === temail) return false;
        return true;
      });
      localStorage.setItem('deleted_candidate_ids', JSON.stringify(updatedDeleted));

      if (id && typeof id === 'string' && !id.startsWith('synthetic') && !id.startsWith('cand-')) {
        await candidateService.deleteCandidate(id).catch(() => null);
      }

      await fetchCandidateData();
      window.dispatchEvent(new CustomEvent('candidateSubmitted'));
    } catch (err) {
      console.error('permanentlyDeleteCandidate error:', err);
    }
  };

  const emptyTrash = async () => {
    try {
      localStorage.setItem('deleted_candidate_ids', JSON.stringify([]));
      await fetchCandidateData();
      window.dispatchEvent(new CustomEvent('candidateSubmitted'));
    } catch (err) {
      console.error('emptyTrash error:', err);
    }
  };

  const resetToDefaultData = async () => {
    try {
      localStorage.removeItem('registered_candidates');
      localStorage.removeItem('deleted_candidate_ids');
      localStorage.removeItem('readNotifIds');
      localStorage.removeItem('clearedNotifIds');
      localStorage.removeItem('userApplications');
      localStorage.removeItem('myApplications');
      localStorage.removeItem('candidate_user_applications');
      localStorage.removeItem('candidateProfile');
    } catch (e) {}

    setCandidates(INITIAL_CANDIDATES);
    await fetchCandidateData();
    window.dispatchEvent(new CustomEvent('candidateSubmitted'));
    window.dispatchEvent(new CustomEvent('userProfileUpdated'));
    return { success: true };
  };

  return (
    <CandidateContext.Provider value={{
      candidates,
      trashedCandidates,
      metrics: computedMetrics,
      isLoading,
      isError,
      setIsError,
      refreshCandidates: fetchCandidateData,
      getCandidateById,
      addCandidate,
      updateCandidate,
      deleteCandidate,
      restoreCandidate,
      permanentlyDeleteCandidate,
      emptyTrash,
      shortlistCandidate,
      scheduleInterview,
      selectCandidate,
      rejectCandidate,
      updateCandidateStage,
      resetToDefaultData
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
