import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar"; 
import TopBar from "../components/AppBar"; 
import AttendanceTracker from "../components/AttendanceTracker"; 

const Dashboard = () => {
  const navigate = useNavigate();
  // State for Sidebar/TopBar integration
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const handleToggle = () => setShowOffcanvas(prev => !prev);
  // Get User Role for conditional rendering
  const userRole = localStorage.getItem("role") || "Employee"; 
  const userName = localStorage.getItem("username") || "User";
  // Using Bootstrap Icons (bi bi-x-y)
  const sections = [
    {
      title: "Manage Employees",
      description: "Add, edit, and remove employees.",
      icon: <i className="bi bi-people-fill fs-3"></i>,
      route: "/employees",
      allowedRoles: ["Admin", "HR"],
      color: "bg-primary", 
    },
    {
      title: "Leave Approvals",
      description: "Review and approve leave requests.",
      icon: <i className="bi bi-list-check fs-3"></i>,
      route: "/approveleave",
      allowedRoles: ["Admin", "HR"],
      color: "bg-danger",
    },
    {
      title: "Attendance Approval",
      description: "Approve/Reject employee check-in/out.",
      icon: <i className="bi bi-clipboard-check-fill fs-3"></i>,
      route: "/adminattendance",
      allowedRoles: ["Admin", "HR"],
      color: "bg-warning",
    },
    {
      title: "My Attendance Log",
      description: "View your personal attendance history.",
      icon: <i className="bi bi-calendar-check-fill fs-3"></i>,
      route: "/attendance",
      allowedRoles: ["Employee", "HR"],
      color: "bg-success",
    },
    {
      title: "Apply for Leave",
      description: "Submit a new leave application.",
      icon: <i className="bi bi-send-check-fill fs-3"></i>,
      route: "/leave",
      allowedRoles: ["Employee", "HR"],
      color: "bg-info",
    },
    {
      title: "Reports & Analytics",
      description: "Generate detailed reports.",
      icon: <i className="bi bi-bar-chart-line-fill fs-3"></i>,
      route: "/analytics",
      allowedRoles: ["Admin"],
      color: "bg-secondary",
    },
    {
      title: "System Settings",
      description: "Configure system-wide settings.",
      icon: <i className="bi bi-gear-fill fs-3"></i>,
      route: "/settings",
      allowedRoles: ["Admin"],
      color: "bg-dark",
    },
  ];

  const filteredSections = sections.filter((section) => 
    section.allowedRoles.includes(userRole)
  );

  return (
    // This top-level div controls the overall layout (Sidebar + Content)
    <div className="dashboard-container d-flex">
      
      {/* 1. Sidebar Component (Uses state from Dashboard for Offcanvas) */}
      <Sidebar showOffcanvas={showOffcanvas} handleToggle={handleToggle} />
      
      {/* 2. Main Content Area */}
      <div className="flex-grow-1">
        
        {/* TopBar Component (Uses handler from Dashboard) */}
        <TopBar handleToggle={handleToggle} />

        {/* Padding for the fixed TopBar. It ensures content starts below the fixed bar. */}
        <div className="main-content-wrapper p-4">

          <h1 className="dashboard-header mb-4 text-dark-blue">
            Welcome, {userName}!
          </h1>
          <p className="lead text-muted mb-4">
            {userRole} Dashboard Overview
          </p>
          <div className="row g-4">
            <div className="col-12 col-md-12 col-lg-4">
  
                <AttendanceTracker />
            </div>
            <div className="col-12 col-md-12 col-lg-8">
                <div className="row g-4">
                    <div className="col-12 col-sm-6">
                        <div className="bg-light shadow rounded-4 h-100 p-3">
                            <h5 className=" card-title text-muted">Total Employees</h5>
                            <p className="card-text fs-2 fw-bold text-dark-blue">250</p>
                            <span className="text-success small"><i className="bi bi-arrow-up-right"></i> 5% this month</span>
                        </div>
                    </div>
                    <div className="col-12 col-sm-6">
                        <div className="bg-light shadow rounded-4 h-100 p-3">
                            <h5 className="card-title text-muted">Pending Leaves</h5>
                            <p className="card-text fs-2 fw-bold text-dark-blue">1</p>
                            <span className="text-danger small"><i className="bi bi-clock-fill"></i> Review Required</span>
                        </div>
                    </div>
                </div>
            </div>

          </div> {/* End of Top Row */}
          
          <h2 className="section-title mt-5 mb-4 text-dark-blue">
            Quick Actions
          </h2>
          
          {/* Action Cards (Role Filtered) */}
          <div className="row g-4">
            {filteredSections.map((section, index) => (
              <div className="col-12 col-sm-6 col-lg-4" key={index}>
                <div 
                  className="card card-action-fancy shadow-lg h-100" 
                  onClick={() => navigate(section.route)}
                >
                  <div className={`card-header text-white ${section.color} action-card-header`}>
                    {section.icon}
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-bold text-dark-blue">{section.title}</h5>
                    <p className="card-text text-muted flex-grow-1">{section.description}</p>
                    <button className="btn btn-outline-primary btn-sm mt-2 action-button">
                      Go to Section <i className="bi bi-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div> {/* End of main-content-wrapper */}
      </div> {/* End of dashboard-content */}
    </div>
  );
};

export default Dashboard;