import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEmployeeByUserId, updateEmployee } from "../services/employeeService";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/AppBar";
import LoadingBar from "react-top-loading-bar"; // npm install react-top-loading-bar

// --- Helper Functions (Time Conversion) ---

// 1. API کو بھیجنے کے لیے (24h -> 12h String)
// مثال: "14:30" کو "02:30 PM" میں بدل دے گا
const convertTo12HourFormat = (time24) => {
  if (!time24) return "";
  const [hours, minutes] = time24.split(":");
  let h = parseInt(hours, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12; // 0 کو 12 بنائیں
  return `${h.toString().padStart(2, "0")}:${minutes} ${ampm}`;
};
const convertTo24HourFormat = (time12) => {
  if (!time12) return "";
  if (!time12.includes("AM") && !time12.includes("PM")) return time12; // Already 24h
  const [time, modifier] = time12.split(" ");
  let [hours, minutes] = time.split(":");
  if (hours === "12") hours = "00";
  if (modifier === "PM") hours = parseInt(hours, 10) + 12;
  return `${hours.toString().padStart(2, '0')}:${minutes}`;
};
const EditProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const loadingBarRef = useRef(null); // Loading Bar Reference
  // State
  const [formData, setFormData] = useState({
    Name: "",
    position: "",
    department: "",
    joiningDate: "",
    salary: "",
    shiftName: "",
    shiftStartTime: "",
    shiftEndTime: "",
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [employeeId, setEmployeeId] = useState(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await getEmployeeByUserId(userId);
        if (response && response.data) {
          const data = response.data;
          // ڈیٹا لوڈ کرتے وقت ٹائم کو 24 گھنٹے میں بدلیں تاکہ Input field میں شو ہو سکے
          setFormData({
            ...data,
            shiftStartTime: convertTo24HourFormat(data.shiftStartTime),
            shiftEndTime: convertTo24HourFormat(data.shiftEndTime),
          });
          setEmployeeId(data.id);
        } else {
          setError("Employee details not found.");
        }
      } catch (err) {
        setError("Failed to load employee details.");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [userId, id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!employeeId) {
      setError("Employee ID is missing.");
      return;
    }

    // 1. Start Loading Bar
    if (loadingBarRef.current) loadingBarRef.current.continuousStart();
    setIsSubmitting(true);

    // 2. Prepare Data (Convert Time back to 12 Hour format for API)
    // یہ شرط پوری کرتا ہے کہ: "Shift time start ko 12 hours waly format mae rakho"
    const payload = {
      ...formData,
      shiftStartTime: convertTo12HourFormat(formData.shiftStartTime), // e.g. sends "09:00 AM"
      shiftEndTime: convertTo12HourFormat(formData.shiftEndTime),     // e.g. sends "05:00 PM"
    };

    console.log("Submitting Payload:", payload);

    try {
      await updateEmployee(employeeId, payload);
      
      if (loadingBarRef.current) loadingBarRef.current.complete();
      // تھوڑا سا ڈیلے تاکہ یوزر لوڈنگ بار دیکھ سکے
      setTimeout(() => {
          navigate("/profile");
      }, 500);

    } catch (err) {
      console.error("Update failed:", err);
      setError("Failed to update profile. Please try again.");
      if (loadingBarRef.current) loadingBarRef.current.complete();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex bg-light min-vh-100">
      {/* Top Loading Bar */}
      <LoadingBar color="#0d6efd" height={4} ref={loadingBarRef} />

      {/* Sidebar Component */}
      <Sidebar />

      <div className="flex-grow-1 d-flex flex-column">
        {/* TopBar Component */}
        <TopBar />

        {/* Main Content Area */}
        <div className="container-fluid p-4">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-10">
              
              <h2 className="mb-4 text-dark fw-bold">Edit Employee Profile</h2>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <div className="card shadow-lg border-0 rounded-4">
                <div className="card-body p-4 p-md-5">
                  
                  {/* Avatar Section */}
                  <div className="text-center mb-4">
                    <div className="d-inline-block p-1 rounded-circle border border-primary border-3">
                        {/* Bootstrap Icons کا استعمال کر سکتے ہیں یا Placeholder Image */}
                        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{width: '80px', height: '80px', fontSize: '30px'}}>
                            <span>{formData.Name ? formData.Name.charAt(0).toUpperCase() : "U"}</span>
                        </div>
                    </div>
                    <h4 className="mt-3 fw-bold">{formData.Name || "User Name"}</h4>
                    <p className="text-muted mb-0">
                      {formData.position || "Position"} - {formData.department || "Department"}
                    </p>
                  </div>

                  <hr className="my-4" />

                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      
                      {/* Name */}
                      <div className="col-md-12">
                        <label className="form-label fw-semibold">Name</label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          name="Name"
                          value={formData.Name}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      {/* Position */}
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Position</label>
                        <input
                          type="text"
                          className="form-control"
                          name="position"
                          value={formData.position}
                          onChange={handleChange}
                        />
                      </div>

                      {/* Department */}
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Department</label>
                        <input
                          type="text"
                          className="form-control"
                          name="department"
                          value={formData.department}
                          onChange={handleChange}
                        />
                      </div>

                      {/* Joining Date */}
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Joining Date</label>
                        <input
                          type="date"
                          className="form-control"
                          name="joiningDate"
                          value={formData.joiningDate}
                          onChange={handleChange}
                        />
                      </div>

                      {/* Salary */}
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Salary</label>
                        <input
                          type="number"
                          className="form-control"
                          name="salary"
                          value={formData.salary}
                          onChange={handleChange}
                        />
                      </div>

                      {/* Shift Name (Dropdown) - Requirement Fulfilled */}
                      <div className="col-md-12">
                        <label className="form-label fw-semibold">Shift Name</label>
                        <select
                          className="form-select"
                          name="shiftName"
                          value={formData.shiftName}
                          onChange={handleChange}
                        >
                          <option value="" disabled>Select Shift</option>
                          <option value="Morning">Morning</option>
                          <option value="Afternoon">Afternoon</option>
                          <option value="Evening">Evening</option>
                        </select>
                      </div>

                      {/* Shift Start Time */}
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Shift Start Time</label>
                        <input
                          type="time"
                          className="form-control"
                          name="shiftStartTime"
                          value={formData.shiftStartTime}
                          onChange={handleChange}
                        />
                        <small className="text-muted">Selected time will be saved as AM/PM.</small>
                      </div>

                      {/* Shift End Time */}
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Shift End Time</label>
                        <input
                          type="time"
                          className="form-control"
                          name="shiftEndTime"
                          value={formData.shiftEndTime}
                          onChange={handleChange}
                        />
                      </div>

                    </div>

                    {/* Buttons */}
                    <div className="d-flex justify-content-between mt-5">
                      <button
                        type="button"
                        className="btn btn-outline-secondary px-4"
                        onClick={() => navigate(-1)}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary px-4 fw-bold"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </button>
                    </div>
                  </form>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EditProfile;