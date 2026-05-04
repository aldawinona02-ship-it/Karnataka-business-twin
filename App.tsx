import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import UBIDExplorer from './pages/UBIDExplorer';
import GraphView from './pages/GraphView';
import ReviewerWorkbench from './pages/ReviewerWorkbench';
import AlertCenter from './pages/AlertCenter';
import PolicySandbox from './pages/PolicySandbox';
import GovernanceConsole from './pages/GovernanceConsole';
import UBIDAssignmentCenter from './pages/UBIDAssignmentCenter';
import { PlatformProvider } from './context/PlatformContext';

export default function App() {
  return (
    <PlatformProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<UBIDAssignmentCenter />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="explorer" element={<UBIDExplorer />} />
            <Route path="graph" element={<GraphView />} />
            <Route path="workbench" element={<ReviewerWorkbench />} />
            <Route path="alerts" element={<AlertCenter />} />
            <Route path="sandbox" element={<PolicySandbox />} />
            <Route path="governance" element={<GovernanceConsole />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </PlatformProvider>
  );
}
