import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { AdminExamManagement } from "./pages/AdminExamManagement";
import { CreateAssessment } from "./pages/CreateAssessment";

import DashboardLayout from "./layouts/DashboardLayout";

// Import your components
import { PropertyDasboardSubsection } from "./screens/Frame/sections/PropertyDasboardSubsection/PropertyDasboardSubsection";
import { PropertyMycourseSubsection } from "./screens/Frame/sections/PropertyMycourseSubsection/PropertyMycourseSubsection";
import { PropertyLiveSubsection } from "./screens/Frame/sections/PropertyLiveSubsection/PropertyLiveSubsection";
import  PropertyTestAndSubsection  from "./screens/Frame/sections/PropertyTestAndSubsection/PropertyTestAndSubsection";
import { PropertyClubAndSubsection } from "./screens/Frame/sections/PropertyClubAndSubsection/PropertyClubAndSubsection";
import { DivWrapperSubsection } from "./screens/Frame/sections/DivWrapperSubsection/DivWrapperSubsection";
import { PropertyWrapperSubsection } from "./screens/Frame/sections/PropertyWrapperSubsection/PropertyWrapperSubsection"
import PropertySubsection from "./screens/Frame/sections/PropertySubsection/PropertySubsection";
import { PropertyRewardSubsection } from "./screens/Frame/sections/PropertyRewardSubsection/PropertyRewardSubsection";
import { PropertyRaiseAndSubsection } from "./screens/Frame/sections/PropertyRaiseAndSubsection/PropertyRaiseAndSubsection";
import { PropertyReffrealSubsection } from "./screens/Frame/sections/PropertyReffrealSubsection/PropertyReffrealSubsection";
import { PropertyLoginSubsection } from "./screens/Frame/sections/PropertyLoginSubsection/PropertyLoginSubsection";
import { ExamDetailsPage } from './pages/ExamDetailsPage';
import { ExamEnvironment } from './components/ExamEnvironment/ExamEnvironment';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />

        {/* Dashboard Layout */}
        <Route path="/component" element={<DashboardLayout />}>
        <Route path="/component/login" element={<PropertyLoginSubsection />} />
          <Route path="dashboard" element={<PropertyDasboardSubsection />} />
          <Route path="courses" element={<PropertyMycourseSubsection />} />
          <Route path="live" element={<PropertyLiveSubsection />} />
          <Route path="tests" element={<PropertyTestAndSubsection />} />
          <Route path="clubs" element={<PropertyClubAndSubsection />} />
          <Route path="profile" element={<DivWrapperSubsection />} />
          <Route path="certificates" element={<PropertyWrapperSubsection />} />
          <Route path="leaderboard" element={<PropertySubsection />} />
          <Route path="rewards" element={<PropertyRewardSubsection />} />
          <Route path="doubts" element={<PropertyRaiseAndSubsection />} />
          <Route path="referrals" element={<PropertyReffrealSubsection />} />

        </Route>

        {/* Admin Routes */}
        <Route path="/admin/exam-management" element={<AdminExamManagement />} />
        <Route path="/admin/create-assessment" element={<CreateAssessment />} />
        <Route path="/admin/edit-assessment/:assessmentId" element={<CreateAssessment />} />
        <Route path="/exam-details/:examId" element={<ExamDetailsPage />} />
        <Route path="/exam/:examId" element={<ExamEnvironment />} />
      </Routes>
    </Router>
  );
}

export default App;
