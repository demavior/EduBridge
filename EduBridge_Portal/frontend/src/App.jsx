import './assets/css/App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './views/HomePage';
import LoginPage from './views/LoginPage';
import RegistrationPage from './views/RegistrationPage';
import ProfilePage from './views/ProfilePage';
import Footer from './components/Footer';
import Header from './components/Header';
import Navbar from './components/Navbar';
import FAQ from './views/FAQ';
import ForgotPAssword from './components/ForgotPasswordPage';
import PasswordResetConfirm from './components/PasswordResetConfirm';
import PasswordResetComplete from './components/PasswordResetComplete';
import StudentNavbar from './views/student_dashboard/StudentSideBar';
import StudentDashboard from './views/student_dashboard/StudentDashboard';
import ProtectedRoute from './ProtectedRoute';
import TeacherNavbar from './views/teacher_dashboard/TeacherSideBar';
import TeacherDashboard from './views/teacher_dashboard/TeacherDashboard';
import ParentNavbar from './views/parent_dashboard/ParentSideBar';
import ParentDashboard from './views/parent_dashboard/ParentDashboard';
import CreateClasroom from './views/teacher_dashboard/CreateClassroom';
import UploadVideoDatasetTable from './views/teacher_dashboard/UploadVideoDatasetTable';
import TextDataSetTable from './views/teacher_dashboard/TextDataSetTable';
import CreateSample from './views/teacher_dashboard/CreateSample';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import Manageclassroom from './views/teacher_dashboard/ManageClassroom';
import UpdateClassroom from './views/teacher_dashboard/UpdateClassroom';
import ClassroomSearch from './views/teacher_dashboard/ManageClassroomSearch';
import ManageSample from './views/teacher_dashboard/ManageSample';
import SampleSearch from './views/teacher_dashboard/SampleSearch';
import UpdateSample from './views/teacher_dashboard/UpdateSample';
import CreateQuestion from './views/teacher_dashboard/create_question';
import Updatequestion from './views/teacher_dashboard/updateQuestion';
import EnrollInClasses from './views/student_dashboard/EnrollInClassess';
import TextAnswerQuestion from './views/student_dashboard/TextAnswerQuestion';
import VideoAnswerQuestion from './views/student_dashboard/VideoAnswerQuestion';
import TeacherReport from './views/teacher_dashboard/TeacherReport';
import ViewStudentGrade from './views/student_dashboard/ViewStudentGrade';
import AddStudent from './views/parent_dashboard/AddStudent';
import ParentReport from './views/parent_dashboard/ParentReport';

function App() {
  return (
    <Router>
      <Navbar />
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} exact />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/FAQ" element={<FAQ />} />
        <Route path="/forgot-password" element={<ForgotPAssword />} />
        <Route path="/password-reset-confirm" element={<PasswordResetConfirm />} />
        <Route path="/password-reset-complete" element={<PasswordResetComplete />} />
        <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/student-navbar" element={<StudentNavbar />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/teacher-navbar" element={<TeacherNavbar />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/parent-navbar" element={<ParentNavbar />} />
        <Route path="/parent-dashboard" element={<ParentDashboard />} />
        <Route path="/create-classroom" element={<CreateClasroom />} />
        <Route path="/upload-video-dataset-table" element={<UploadVideoDatasetTable />} />
        <Route path="/text-dataset-table" element={<TextDataSetTable />} />
        <Route path="/create-sample" element={<CreateSample />} />
        <Route path="/manage-classroom" element={<Manageclassroom />} />
        <Route path="/update-classroom/:classroomId" element={<UpdateClassroom />} />
        <Route path="/manage-classroom-search" element={<ClassroomSearch />} />
        <Route path="/manage-sample/:classroomId" element={<ManageSample />} />
        <Route path="/sample-search" element={<SampleSearch />} />
        <Route path="/update-sample/:sampleId" element={<UpdateSample />} />
        <Route path="/create-question/:classroomId" element={<CreateQuestion />} />
        <Route path="/update-question/:classroomId" element={<Updatequestion />} />
        <Route path="/enroll-in-classes" element={<EnrollInClasses />} />
        <Route path="/text-answer-question/:classroomId/sample/:sampleId" element={<TextAnswerQuestion />} />
        <Route path="/video-answer-question/:classroomId/sample/:sampleId" element={<VideoAnswerQuestion />} />
        <Route path="/teacher-report" element={<TeacherReport />} />
        <Route path="/student-grade" element={<ViewStudentGrade />} />
        <Route path="/add-student" element={<AddStudent />} />
        <Route path="/view-report" element={<ParentReport />} />


        </Route>
      </Routes>
      <Footer />
    </Router>
  );
}

iziToast.settings({
  timeout: 5000, 
  resetOnHover: true,
  icon: 'material-icons',
  transitionIn: 'fadeInUp',
  transitionOut: 'fadeOut',
  position: 'topRight', 
  theme: 'light', 
});

export const showSuccessNotification = (message) => {
  iziToast.success({
    title: 'Success',
    message: message,
    position: 'center', 
    backgroundColor: 'green', 
  });
};

export const showErrorNotification = (message) => {
  iziToast.error({
    title: 'Error',
    message: message,
    position: 'topRight', 
    backgroundColor: 'red',
  });
};

export default App;
