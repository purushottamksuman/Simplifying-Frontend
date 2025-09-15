import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { AdminExamManagement } from "./pages/AdminExamManagement";
import { CreateAssessment } from "./pages/CreateAssessment";

import DashboardLayout from "./layouts/DashboardLayout";
import TeacherLayout from "./layouts/TeacherLayout";

// Import your components
import { PropertyDasboardSubsection } from "./screens/Frame/sections/PropertyDasboardSubsection/PropertyDasboardSubsection";
import { PropertyMycourseSubsection } from "./screens/Frame/sections/PropertyMycourseSubsection/PropertyMycourseSubsection";
import { PropertyLiveSubsection } from "./screens/Frame/sections/PropertyLiveSubsection/PropertyLiveSubsection";
import  PropertyTestAndSubsection  from "./screens/Frame/sections/PropertyTestAndSubsection/PropertyTestAndSubsection";
import { PropertyClubAndSubsection } from "./screens/Frame/sections/PropertyClubAndSubsection/PropertyClubAndSubsection";
import { DivWrapperSubsection as StudentProfile } from "./screens/Frame/sections/DivWrapperSubsection/DivWrapperSubsection";
import { DivWrapperSubsection as TeacherProfile } from "./screens/teacher-flow/DivWrapperSubsection/DivWrapperSubsection";
import { PropertyWrapperSubsection } from "./screens/Frame/sections/PropertyWrapperSubsection/PropertyWrapperSubsection"
import PropertySubsection from "./screens/Frame/sections/PropertySubsection/PropertySubsection";
import { PropertyRewardSubsection } from "./screens/Frame/sections/PropertyRewardSubsection/PropertyRewardSubsection";
import { PropertyRaiseAndSubsection } from "./screens/Frame/sections/PropertyRaiseAndSubsection/PropertyRaiseAndSubsection";
import { PropertyReffrealSubsection } from "./screens/Frame/sections/PropertyReffrealSubsection/PropertyReffrealSubsection";
import { PropertyLoginSubsection } from "./screens/Frame/sections/PropertyLoginSubsection/PropertyLoginSubsection";
import { ExamDetailsPage } from './pages/ExamDetailsPage';
import { ExamEnvironment } from './components/ExamEnvironment/ExamEnvironment';
import { PropertyCommanSubsection } from "./screens/Frame/sections/PropertyCommanSubsection/PropertyCommanSubsection";
import { PropertyOtpSubsection } from "./screens/Frame/sections/PropertyOtpSubsection/PropertyOtpSubsection";
import { SomethingWentWrong } from "./screens/Frame/sections/SomethingWentWrong/SomethingWentWrong";
import ParentLayout from "./layouts/ParentLayout";
import PropertyParentDashboard from "./screens/parent-flow/PropertyParentDashboard/PropertyParentDashboard";
import PropertyTeacherDashboard from "./screens/teacher-flow/PropertyTeacherDashboard/PropertyTeacherDashboard";

import QuestionManagementSystem from "./components/QuestionManagementSystem/QuestionManagementSystem";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
          <Route path="signup" element={<PropertyCommanSubsection />} />
        <Route path="/login" element={<PropertyLoginSubsection />} />
        <Route path="/otp" element={<PropertyOtpSubsection />} />
        <Route path="/error" element={<SomethingWentWrong />} />


        {/* Dashboard Layout */}
        <Route path="/component" element={<DashboardLayout />}>
          <Route path="dashboard" element={<PropertyDasboardSubsection />} />
          <Route path="courses" element={<PropertyMycourseSubsection />} />
          <Route path="live" element={<PropertyLiveSubsection />} />
          <Route path="tests" element={<PropertyTestAndSubsection />} />
          <Route path="clubs" element={<PropertyClubAndSubsection />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="certificates" element={<PropertyWrapperSubsection />} />
          <Route path="leaderboard" element={<PropertySubsection />} />
          <Route path="rewards" element={<PropertyRewardSubsection />} />
          <Route path="doubts" element={<PropertyRaiseAndSubsection />} />
          <Route path="referrals" element={<PropertyReffrealSubsection />} />
          <Route path="questionManagementSystem" element={<QuestionManagementSystem />} />

        </Route>


          {/* Teacher Layout */}
<Route path="/teacher" element={<TeacherLayout />}>
  <Route path="dashboard" element={<PropertyTeacherDashboard />} />
          <Route path="courses" element={<PropertyMycourseSubsection />} />
          <Route path="live" element={<PropertyLiveSubsection />} />
          <Route path="tests" element={<PropertyTestAndSubsection />} />
  <Route path="clubs" element={<PropertyClubAndSubsection />} />
  <Route path="profile" element={<TeacherProfile />} />
  <Route path="certificates" element={<PropertyWrapperSubsection />} />
  <Route path="leaderboard" element={<PropertySubsection />} />
  <Route path="rewards" element={<PropertyRewardSubsection />} />
  <Route path="doubts" element={<PropertyRaiseAndSubsection />} />
  <Route path="referrals" element={<PropertyReffrealSubsection />} />
</Route>

{/* Parent Layout  */}
<Route path="/parent" element={<ParentLayout />}>
  <Route path="dashboard" element={<PropertyParentDashboard />} />
  <Route path="courses" element={<PropertyMycourseSubsection />} />
  <Route path="live" element={<PropertyLiveSubsection />} />
  <Route path="tests" element={<PropertyTestAndSubsection />} />
  <Route path="clubs" element={<PropertyClubAndSubsection />} />
  <Route path="profile" element={<ParentLayout />} />
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
