import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ComponentPage } from './pages/ComponentPage';
import { AdminExamManagement } from './pages/AdminExamManagement';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/component/:componentName" element={<ComponentPage />} />
        <Route path="/admin/exam-management" element={<AdminExamManagement />} />
      </Routes>
    </Router>
  );
}

export default App;