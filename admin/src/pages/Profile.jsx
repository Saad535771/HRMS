import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import LoadingBar from "react-top-loading-bar"; // Import Loading Bar
import { getEmployeeByUserId } from "../services/employeeService";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/AppBar";

const Profile = () => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Ref for Loading Bar
  const ref = useRef(null);
  
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getEmployeeByUserId(userId);
        if (response && response.data) {
          setEmployee(response.data);
        } else {
          setError("Employee details not found.");
        }
      } catch (err) {
        setError("Failed to load employee details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  // Handle Edit Click with Loading Bar animation
  const handleEditClick = () => {
    if (ref.current) {
      ref.current.continuousStart(); // Start loading bar
      
      // Simulate a small delay for effect before navigating
      setTimeout(() => {
        ref.current.complete();
        navigate(`/update/${employee.id}`);
      }, 800);
    }
  };

  return (
    <div className="d-flex bg-light min-vh-100">
      {/* Top Loading Bar */}
      <LoadingBar color="#f11946" ref={ref} shadow={true} height={3} />

      {/* Sidebar */}
      <Sidebar />

      <div className="flex-grow-1 d-flex flex-column">
        {/* TopBar */}
        <TopBar />

        <div className="container-fluid p-4">
          <h2 className="text-center fw-bold mb-4 text-dark opacity-75">
            Employee Profile
          </h2>

          {/* Loading State */}
          {loading && (
            <div className="d-flex justify-content-center mt-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center mt-5">
              <i className="bi bi-exclamation-triangle-fill text-danger display-4"></i>
              <p className="text-danger mt-2 fw-bold">{error}</p>
            </div>
          )}

          {/* Profile Card */}
          {!loading && !error && (
            <div className="row justify-content-center">
              <div className="col-md-8 col-lg-6">
                <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                  
                  {/* Decorative Header Background */}
                  <div 
                    className="bg-primary" 
                    style={{ 
                      height: "120px", 
                      background: "linear-gradient(135deg, #667eea 0%, #0767a3ff 100%)" 
                    }}
                  ></div>
                  <div className="card-body text-center relative-position mt-n5">
                    {/* Avatar Image/Icon */}
                    <div 
                      className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center shadow" 
                      style={{ 
                        width: "100px", 
                        height: "100px", 
                        marginTop: "-50px", 
                        border: "4px solid white" 
                      }}
                    >
                      <i className="bi bi-person-circle text-primary" style={{ fontSize: "3.5rem" }}></i>
                    </div>

                    <h3 className="fw-bold mt-3 text-dark">{username || "N/A"}</h3>
                    <p className="text-muted mb-3">
                      {employee?.position || "N/A"} <span className="mx-2">|</span> {employee?.department || "N/A"}
                    </p>

                    <hr className="my-4 text-secondary opacity-25" />

                    {/* Employee Details Grid */}
                    <div className="row text-start g-3">
                      {/* Detail Item Component */}
                      <ProfileItem 
                        icon="bi-building" 
                        color="text-primary" 
                        label="Department" 
                        value={employee?.department} 
                      />
                      <ProfileItem 
                        icon="bi-briefcase-fill" 
                        color="text-success" 
                        label="Position" 
                        value={employee?.position} 
                      />
                      <ProfileItem 
                        icon="bi-calendar-date-fill" 
                        color="text-danger" 
                        label="Joining Date" 
                        value={employee?.joiningDate} 
                      />
                      <ProfileItem 
                        icon="bi-cash-stack" 
                        color="text-warning" 
                        label="Salary" 
                        value={employee?.salary ? `$${employee.salary}` : "N/A"} 
                      />
                      <ProfileItem 
                        icon="bi-clock-fill" 
                        color="text-info" 
                        label="Shift Timing" 
                        value={employee?.shiftStartTime && employee?.shiftEndTime 
                          ? `${employee.shiftStartTime} - ${employee.shiftEndTime}` 
                          : "N/A"} 
                      />
                    <ProfileItem 
  icon="bi-heart-fill"  
  label="Shift Slot" 
  value={employee?.shiftName || "N/A"} 
/>

                    </div>

                    {/* Edit Button */}
                    <button
                      className="btn btn-primary w-100 mt-4 py-2 rounded-3 fw-bold shadow-sm"
                      onClick={handleEditClick}
                      disabled={!employee?.id}
                      style={{ 
                        background: "linear-gradient(to right, #007bff, #0056b3)", 
                        border: "none",
                        transition: "transform 0.2s"
                      }}
                      onMouseOver={(e) => e.target.style.transform = "scale(1.02)"}
                      onMouseOut={(e) => e.target.style.transform = "scale(1)"}
                    >
                      <i className="bi bi-pencil-square me-2"></i> Edit Profile
                    </button>

                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Reusable Helper Component for List Items to keep code clean
const ProfileItem = ({ icon, color, label, value }) => (
  <div className="col-12">
    <div className="d-flex align-items-center p-3 rounded-3 bg-light border border-light hover-shadow transition-all">
      <div className={`fs-4 me-3 ${color}`}>
        <i className={`bi ${icon}`}></i>
      </div>
      <div>
        <small className="text-muted d-block text-uppercase fw-bold" style={{ fontSize: "0.75rem" }}>
          {label}
        </small>
        <span className="fw-semibold text-dark">
          {value || "N/A"}
        </span>
      </div>
    </div>
  </div>
);

export default Profile;