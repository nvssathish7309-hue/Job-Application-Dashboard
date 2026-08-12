import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CandidateProvider } from './context/CandidateContext';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Candidates from './pages/Candidates';
import CandidateDetails from './pages/CandidateDetails';
import AddCandidate from './pages/AddCandidate';
import Settings from './pages/Settings';
import Trash from './pages/Trash';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <BrowserRouter>
      <CandidateProvider>
        <DashboardLayout searchQuery={searchQuery} setSearchQuery={setSearchQuery}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/candidates" element={<Candidates />} />
            <Route path="/candidates/add" element={<AddCandidate />} />
            <Route path="/candidates/:id" element={<CandidateDetails />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/trash" element={<Trash />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </DashboardLayout>
      </CandidateProvider>
    </BrowserRouter>
  );
}
