import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ComponentPage } from './pages/ComponentPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/component/:componentName" element={<ComponentPage />} />
      </Routes>
    </Router>
  );
}

export default App;