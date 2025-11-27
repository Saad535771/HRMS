import axios from "axios";
import BaseUrl from "../api/baseurl";
const serverUrl=BaseUrl();
const API_URL = serverUrl+"employees";
const USER=serverUrl+"users";
const getAuthHeaders = () => ({
  headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
});

// Get all employees (Admin, HR, ReportingManager only)
export const getAllEmployees = async () => {
  return axios.get(API_URL, getAuthHeaders());
};
// Get employee by userId
export const getEmployeeByUserId = async (userId) => {
  return axios.get(`${API_URL}/${userId}`, getAuthHeaders());
};
// Update employee details (Admin, HR, ReportingManager only)
export const updateEmployee = async (id, employeeData) => {
  return axios.put(`${API_URL}/update/${id}`, employeeData, getAuthHeaders());
};
// Delete an employee (Only Admin)
export const deleteEmployee = async (id) => {
  return axios.delete(`${API_URL}/delete/${id}`, getAuthHeaders());
};
export const registerEmployee = async (employeeData) => {
  return axios.post(`${USER}/register`, employeeData, {
    headers: { "Content-Type": "application/json" },
  });
};