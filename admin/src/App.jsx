import React from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Employee from "./pages/Employees";
import EditProfile from "./pages/EditProfile";
import Attendance from "./pages/Attendance";
import AdminAttendance from "./pages/AdminAttendance";
import ApplyLeave from "./pages/ApplyLeave";
import AdminLeaveApproval from "./pages/AdminLeaveApproval";
import Register from "./pages/Register";
import './App.css';
import OvertimeSubmit from "./pages/OvertimeSubmit";
// Protected Route Component
const ProtectedRoute = ({ element, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role"); // Get role from storage
  if (!token) return <Navigate to="/login" />; // If no token, redirect to login
  if (!allowedRoles.includes(userRole)) return <Navigate to="/dashboard" />; // Redirect if role isn't allowed
  return element;
};
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register:admin-authority:sajjad-riaz" element={<Register />} />
        {/* Common for all users */}
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} allowedRoles={["Admin", "HR", "Employee"]} />} />
        <Route path="/profile" element={<ProtectedRoute element={<Profile />} allowedRoles={["Admin", "HR", "Employee"]} />} />
        {/* Employee Routes */}
        <Route path="/employees" element={<ProtectedRoute element={<Employee />} allowedRoles={["HR", "Admin"]} />} />
        <Route path="/attendance" element={<ProtectedRoute element={<Attendance />} allowedRoles={["Employee", "HR"]} />} />
        <Route path="/leave" element={<ProtectedRoute element={<ApplyLeave />} allowedRoles={["Employee","HR"]} />} />
        {/* HR/Admin Routes */}
        <Route path="/adminattendance" element={<ProtectedRoute element={<AdminAttendance />} allowedRoles={["HR", "Admin"]} />} />
        <Route path="/approveleave" element={<ProtectedRoute element={<AdminLeaveApproval />} allowedRoles={["HR","Admin"]} />} />
        <Route path="/overtime-submission" element={<ProtectedRoute element={<OvertimeSubmit />} allowedRoles={["HR","Admin"]} />} />
        {/* Edit Profile (Only for Admin & HR) */}
        <Route path="/update/:id" element={<ProtectedRoute element={<EditProfile />} allowedRoles={["HR", "Admin","Employee"]} />} />
        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};
export default App;