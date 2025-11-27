import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
const TopBar = ({ handleToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  useEffect(() => {
    // Initialize role and username from localStorage
    setRole(localStorage.getItem("role") || "Guest");
    setUsername(localStorage.getItem("username") || "User");
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    navigate("/login");
  };
  const handleHome = () => {
    navigate("/dashboard");
  };
  const routeNames = {
    "/dashboard": "Dashboard Overview",
    "/profile": "My Profile",
    "/approveleave": "Leave Requests",
    "/employees": "Employee Management",
    "/attendance": "My Attendance Log",
    "/adminattendance": "Attendance Approval",
    "/leave": "Apply for Leave",
    "/": "Welcome Panel",
  };
  const currentPageTitle = routeNames[location.pathname] || "Admin Panel";
  return (
    <nav className="navbar navbar-expand-lg dark-gradient-appbar sticky-top topbar-shadow">
      <div className="container-fluid px-4">
        <button
          className="btn btn-transparent-gold me-3 d-md-none"
          onClick={handleToggle}
          aria-label="Toggle Sidebar Menu">
          <i className="bi bi-list fs-4"></i>
        </button>
        <button className="btn btn-transparent-gold me-3 d-none d-md-block"
          onClick={handleHome} aria-label="Go to Dashboard">
          <i className="bi bi-house-fill fs-4"></i>
        </button>
        <div className="d-lg-none d-flex align-items-center me-auto">
          <span className="text-white-50 small me-2">Role:</span>
          <span className="text-primary-gold fw-bold">{role}</span>
        </div>
        <div className="d-none d-lg-block mx-auto text-center flex-grow-1">
          <h1 className="navbar-title-center mb-0 text-white" style={{ maxWidth: '600px' }}>
            {currentPageTitle}
          </h1>
        </div>
        <div className="d-flex align-items-center">
          <div className="d-none d-md-flex align-items-center me-4">
            <i className="bi bi-person-bounding-box text-white me-2 fs-5"></i>
            <div className="text-end">
              <small className="d-block text-white fw-bold">{username}</small>
              <small className="d-block text-primary-gold small-role-text">{role}</small>
            </div>
          </div>

          {/* Logout Button */}
          <button
            className="btn btn-outline-gold logout-btn"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right me-2"></i>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default TopBar;