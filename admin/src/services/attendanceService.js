import axios from "axios";
import BaseUrl from "../api/baseurl";

const server_URL = BaseUrl() + "attendance";
const API_URL = server_URL;

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

// -------------------------
// ✔️ EMPLOYEE CHECK-IN
// -------------------------
export const checkIn = async (userId) => {
  try {
    const response = await axios.post(
      `${API_URL}/check-in`,
      { userId },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || "Check-in failed";
  }
};

// -------------------------
// ✔️ EMPLOYEE CHECK-OUT
// -------------------------
export const checkOut = async (userId) => {
  try {
    const response = await axios.post(
      `${API_URL}/check-out`,
      { userId },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || "Check-out failed";
  }
};

// -------------------------
// ✔️ GET USER ATTENDANCE RECORD
// -------------------------
export const getAttendanceByUserId = async (userId) => {
  const response = await axios.get(`${API_URL}/${userId}`, getAuthHeaders());
  return response.data;
};

// -------------------------
// ✔️ APPROVE ATTENDANCE (ADMIN / HR)
// -------------------------
export const approveAttendance = async (attendanceIds, status) => {
  try {
    const response = await axios.put(
      `${API_URL}/approve`,
      { attendanceIds, status },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || "Approval failed";
  }
};

// -------------------------
// ✔️ GET ALL ATTENDANCE (ADMIN)
// -------------------------
export const getAllAttendance = async () => {
  try {
    const response = await axios.get(API_URL, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response?.data || "Failed to fetch attendance";
  }
};

// -------------------------
// ✔️ DELETE ATTENDANCE (ADMIN)
// -------------------------
export const deleteAttendance = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response?.data || "Failed to delete record";
  }
};



// ✅ Employee: Submit Overtime Request
export const submitOvertime = async (data) => {
  try {
    const response = await axios.post(
      `${API_URL}/overtime/submit`,
      data,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || "Failed to submit overtime";
  }
};

// ✅ Employee/Admin: Get Overtime by User ID
export const getUserOvertime = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/overtime/${userId}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response?.data || "Failed to fetch overtime";
  }
};

// Get All Overtime (Admin)
export const getAllOvertime = async () => {
  const response = await axios.get(`${API_URL}/overtime`, getAuthHeaders());
  return response.data;
};

// Approve/Reject Overtime (Admin)
export const approveOvertime = async (overtimeIds, status) => {
  const response = await axios.put(`${API_URL}/overtime/approve`, { overtimeIds, status }, getAuthHeaders());
  return response.data;
};

// Delete Overtime (Admin)
export const deleteOvertime = async (id) => {
  const response = await axios.delete(`${API_URL}/overtime/${id}`, getAuthHeaders());
  return response.data;
};
// -------------------------
// ✔️ GET MONTHLY ATTENDANCE REPORT (Admin)
// -------------------------
export const getMonthlyAttendanceReport = async (userId, month, year) => {
  try {
    const response = await axios.get(
      `${API_URL}/monthly/${userId}?month=${month}&year=${year}`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || "Failed to fetch monthly attendance report";
  }
};
