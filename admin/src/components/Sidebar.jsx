import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
// Assuming you import './Sidebar.css' here

const Sidebar = ({ showOffcanvas, handleToggle }) => { 
  const location = useLocation();
  const [selected, setSelected] = useState(location.pathname);
  const [role, setRole] = useState("");
  
  // ... (Update State logic remains the same) ...
  const updateStateFromLocation = useCallback(() => {
    const storedRole = localStorage.getItem("role") || "Employee"; 
    setRole(storedRole);
    setSelected(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    updateStateFromLocation();
  }, [updateStateFromLocation]);

  const menuItems = [
    // ... (menuItems remain the same) ...
    { text: "Dashboard", icon: <i className="bi bi-grid-1x2-fill"></i>, path: "/dashboard", roles: ["Admin", "HR", "Employee"] },
    { text: "Profile", icon: <i className="bi bi-person-circle"></i>, path: "/profile", roles: ["Admin", "HR", "Employee"] },
    { text: "Employees", icon: <i className="bi bi-people-fill"></i>, path: "/employees", roles: ["Admin", "HR"] },
    { text: "My Attendance", icon: <i className="bi bi-calendar-check-fill"></i>, path: "/attendance", roles: ["Employee", "HR"] },
    { text: "Approve Attendance", icon: <i className="bi bi-clipboard-check-fill"></i>, path: "/adminattendance", roles: ["HR", "Admin"] },
    { text: "Apply Leave", icon: <i className="bi bi-send-check-fill"></i>, path: "/leave", roles: ["Employee","HR"] },
    { text: "Leave Approvals", icon: <i className="bi bi-list-check"></i>, path: "/approveleave", roles: ["HR","Admin"] },


  ];

  const filteredMenu = menuItems.filter((item) => item.roles.includes(role));
  
  const navLinks = filteredMenu.map((item) => (
    <li className="nav-item mx-2 my-1" key={item.text}>
      <Link
        to={item.path}
        className={`nav-link nav-link-fancy d-flex align-items-center p-3 text-white ${selected === item.path ? "active-link-fancy" : ""}`}
        onClick={() => {
          setSelected(item.path);
          if (handleToggle) {
              // Toggle is called to CLOSE the offcanvas
              handleToggle(); 
          }
        }}
      >
        <div className="me-3 nav-icon-wrapper">
          {item.icon}
        </div>
        {item.text}
      </Link>
    </li>
  ));

  const sidebarContent = (
    <div className="d-flex flex-column h-100 sidebar-container dark-gradient-bg">
      {/* ... (Sidebar content remains the same) ... */}
      <div className="text-center py-4 sidebar-header-bg">
        <h5 className="mb-0 fw-bold text-primary-gold" style={{ letterSpacing: '2px' }}>
          {role} Panel
        </h5>
      </div>
      <hr className="my-0 mx-4 border-secondary opacity-25" />
      <div className="flex-grow-1 overflow-auto custom-scrollbar">
        <ul className="nav nav-pills flex-column mb-auto pt-3">
          {navLinks}
        </ul>
      </div>
      <div className="text-center py-3 border-top border-secondary sidebar-footer-bg">
        <p className="mb-0 text-white fw-bold">{localStorage.getItem("username") || "John Doe"}</p>
        <small className="text-primary-gold">{localStorage.getItem("role") || "User"}</small>
      </div>
    </div>
  );
  return (
    <>
      {/* 2. Desktop Sidebar */}
      <div className="d-none d-md-block sidebar-custom-width vh-100 position-sticky top-0" style={{ zIndex: 1030 }}>
        {sidebarContent}
      </div>

      <div 
        // We rely on Bootstrap's mechanism by simply adding the 'show' class
        // and removing the manual visibility style, allowing Bootstrap's transitions to handle it.
        className={`offcanvas offcanvas-start offcanvas-fancy sidebar-custom-width ${showOffcanvas ? 'show' : ''}`} 
        tabIndex="-1" 
        id="offcanvasSidebar"
        // REMOVED: style={{ visibility: showOffcanvas ? 'visible' : 'hidden' }}
        data-bs-backdrop="true" 
      >
        {/* We add a proper close button inside the offcanvas for user experience */}
        <div className="offcanvas-header bg-dark d-flex justify-content-end align-items-center d-md-none">
          <button 
            type="button" 
            className="btn-close-fancy" 
            onClick={handleToggle} // Close on button click
            aria-label="Close"
          >
             <i className="bi bi-x-lg text-white"></i>
          </button>
        </div>
        
        <div className="offcanvas-body p-0">
          {sidebarContent}
        </div>
      </div>
    </>
  );
};

export default Sidebar;