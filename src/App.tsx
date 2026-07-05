// src/App.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import { Teachers } from "./pages/Teachers";
import Departments from "./pages/Departments";
import DepartmentCreate from "./pages/DepartmentCreate";
import DepartmentEdit from "./pages/DepartmentEdit";
import DepartmentDetailPage from "./pages/DepartmentDetailPage";
import { Subjects } from "./pages/Subjects";
import { SubjectDetailPage } from "./pages/SubjectDetailPage";
import { Assignments } from "./pages/Assignments";
import { EvaluationPeriods } from "./pages/EvaluationPeriods";
import { EvaluationForms } from "./pages/EvaluationForms";
import EvaluationFormDetail from "./pages/EvaluationFormDetail";
import TeacherAssignments from "./pages/TeacherAssignment"; // Default import (no curly braces)
import { EvaluationSubmissionPage } from "./pages/EvaluationSubmissionPage";
import { ProtectedRoute } from "./components/ProtectedRoute";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/evaluate/:token" element={<EvaluationSubmissionPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Teacher Routes */}
        <Route
          path="/teachers"
          element={
            <ProtectedRoute>
              <Teachers />
            </ProtectedRoute>
          }
        />

        {/* Department Routes */}
        <Route
          path="/departments"
          element={
            <ProtectedRoute>
              <Departments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/departments/create"
          element={
            <ProtectedRoute>
              <DepartmentCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/departments/edit/:id"
          element={
            <ProtectedRoute>
              <DepartmentEdit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/departments/:id"
          element={
            <ProtectedRoute>
              <DepartmentDetailPage />
            </ProtectedRoute>
          }
        />

        {/* Subject Routes */}
        <Route
          path="/subjects"
          element={
            <ProtectedRoute>
              <Subjects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subjects/:id"
          element={
            <ProtectedRoute>
              <SubjectDetailPage />
            </ProtectedRoute>
          }
        />

        {/* Assignment Routes */}
        <Route
          path="/assignments"
          element={
            <ProtectedRoute>
              <Assignments />
            </ProtectedRoute>
          }
        />

        {/* Evaluation Period Routes */}
        <Route
          path="/evaluation-periods"
          element={
            <ProtectedRoute>
              <EvaluationPeriods />
            </ProtectedRoute>
          }
        />

        {/* Evaluation Form Routes */}
        <Route
          path="/evaluation-forms"
          element={
            <ProtectedRoute>
              <EvaluationForms />
            </ProtectedRoute>
          }
        />
        <Route
          path="/evaluation-forms/:id"
          element={
            <ProtectedRoute>
              <EvaluationFormDetail />
            </ProtectedRoute>
          }
        />

        {/* Teacher Assignment Routes */}
        <Route
          path="/teacher-assignments"
          element={
            <ProtectedRoute>
              <TeacherAssignments />
            </ProtectedRoute>
          }
        />

        {/* Default Route - Redirect to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Catch all - Redirect to login for any undefined routes */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
