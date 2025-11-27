import React, { useEffect, useState } from "react";
import LoadingBar from "react-top-loading-bar";
import {
  getAllEmployees,
  deleteEmployee,
  registerEmployee,
  // make sure you add this in your service:
  // export const updateEmployee = (id, data) => api.put(`/employees/${id}`, data);
  updateEmployee,
} from "../services/employeeService";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/AppBar";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loadingTable, setLoadingTable] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [progress, setProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");

  // Create User state (auth user)
  const [newEmployee, setNewEmployee] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "Employee",
  });

  // Edit Employee state (for updateEmployee backend)
  const [editForm, setEditForm] = useState({
    id: "",
    Name: "",
    position: "",
    department: "",
    salary: "",
    joiningDate: "",
    shiftName: "",
    shiftStartTime: "",
    shiftEndTime: "",
  });
  useEffect(() => {
    fetchEmployees();
  }, []);
  const convertTo12Hour = (time24) => {
    if (!time24) return "";
    const [hoursStr, minutes] = time24.split(":");
    let hours = parseInt(hoursStr, 10);
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const h = hours.toString().padStart(2, "0");
    return `${h}:${minutes} ${ampm}`;
  };
  const fetchEmployees = async () => {
    try {
      setProgress(30);
      setLoadingTable(true);
      const response = await getAllEmployees();
      setEmployees(response.data || response);
      setProgress(100);
    } catch (error) {
      console.error("Error fetching employees", error);
      setProgress(100);
      alert("Error fetching employees");
    } finally {
      setLoadingTable(false);
    }
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      setProgress(30);
      await deleteEmployee(id);
      await fetchEmployees();
      setSuccessMessage("Employee deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 2000);
      setProgress(100);
    } catch (error) {
      console.error("Error deleting employee:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to delete employee.");
      setProgress(100);
    }
  };
  const handleCreateEmployee = async () => {
    if (!newEmployee.firstName || !newEmployee.email || !newEmployee.password) {
      alert("First Name, Email, and Password are required.");
      return;
    }
    try {
      setProgress(30);
      const employeeData = {
        first_name: newEmployee.firstName,
        last_name: newEmployee.lastName,
        email: newEmployee.email,
        password: newEmployee.password,
        role: newEmployee.role,
      };
      await registerEmployee(employeeData);
      setShowCreateModal(false);
      setSuccessMessage("User Registered Successfully! 🎉");

      setNewEmployee({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "Employee",
      });
      await fetchEmployees();
      setProgress(100);
      setTimeout(() => setSuccessMessage(""), 2000);
    } catch (error) {
      console.error("Error creating employee:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to create employee.");
      setProgress(100);
    }
  };

  const openEditModal = (employee) => {
    setEditForm({
      id: employee.id,
      Name: employee.Name || "",
      position: employee.position || "",
      department: employee.department || "",
      salary: employee.salary || "",
      joiningDate: employee.joiningDate
        ? employee.joiningDate.split("T")[0]
        : "",
      shiftName: employee.shiftName || "",
      shiftStartTime: convertTo12Hour(employee.shiftStartTime),
      shiftEndTime: convertTo12Hour(employee.shiftEndTime),
    });
    setShowEditModal(true);
  };

  const handleUpdateEmployee = async () => {
    if (!editForm.id) {
      alert("Employee ID missing.");
      return;
    }

    try {
      setProgress(30);

      const payload = {
        Name: editForm.Name,
        position: editForm.position,
        department: editForm.department,
        salary: editForm.salary,
        joiningDate: editForm.joiningDate,
        shiftName: editForm.shiftName,
        shiftStartTime: editForm.shiftStartTime, // backend converts "09:00 AM" -> "09:00"
        shiftEndTime: editForm.shiftEndTime,
      };

      await updateEmployee(editForm.id, payload);
      setShowEditModal(false);
      setSuccessMessage("Employee updated successfully! ✅");
      await fetchEmployees();
      setProgress(100);
      setTimeout(() => setSuccessMessage(""), 2000);
    } catch (error) {
      console.error("Error updating employee:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to update employee.");
      setProgress(100);
    }
  };

  const handleChangeNew = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeEdit = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="d-flex bg-light min-vh-100">
      <LoadingBar
        color="#293EED"
        height={3}
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />

      <Sidebar />

      <div className="flex-grow-1 p-3">
        <TopBar />

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="fw-bold text-dark mb-0">
            Employee Management <span role="img" aria-label="emp">🧑‍💼</span>
          </h3>

          <button
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            <i className="bi bi-person-plus me-2"></i>
            Add New User
          </button>
        </div>

        {successMessage && (
          <div className="alert alert-success py-2">
            {successMessage}
          </div>
        )}

        <div className="card shadow-sm">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-striped table-hover mb-0">
                <thead className="table-primary">
                  <tr>
                    <th>ID</th>
                    <th>User ID</th>
                    <th>Name</th>
                    <th>Position</th>
                    <th>Department</th>
                    <th>Salary</th>
                    <th>Joining Date</th>
                    <th>Shift Name</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingTable ? (
                    <tr>
                      <td colSpan="13" className="text-center py-4">
                        Loading employees...
                      </td>
                    </tr>
                  ) : employees && employees.length > 0 ? (
                    employees.map((emp) => (
                      <tr key={emp.id}>
                        <td>{emp.id}</td>
                        <td>{emp.userId || "-"}</td>
                        <td>{emp.Name || "N/A"}</td>
                        <td>{emp.position || "N/A"}</td>
                        <td>{emp.department || "N/A"}</td>
                        <td>{emp.salary || "N/A"}</td>
                        <td>
                          {emp.joiningDate
                            ? new Date(emp.joiningDate).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td>{emp.shiftName || "N/A"}</td>
                        <td>{emp.shiftStartTime || "N/A"}</td>
                        <td>{emp.shiftEndTime || "N/A"}</td>
                        <td>{emp.email || "N/A"}</td>
                        <td>{emp.role || "N/A"}</td>
                        <td className="text-center">
                          <button
                            className="btn btn-sm btn-outline-danger me-2"
                            onClick={() => handleDelete(emp.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => openEditModal(emp)}
                          >
                            <i className="bi bi-pencil-square me-1"></i>
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="13" className="text-center py-4">
                        No employees found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* CREATE USER MODAL */}
        {showCreateModal && (
          <div className="modal d-block" tabIndex="-1">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="bi bi-person-plus me-2"></i>
                    Register New User
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowCreateModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">First Name *</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-person"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          name="firstName"
                          placeholder="Enter first name"
                          value={newEmployee.firstName}
                          onChange={handleChangeNew}
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Last Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="lastName"
                        placeholder="Enter last name (optional)"
                        value={newEmployee.lastName}
                        onChange={handleChangeNew}
                      />
                    </div>

                    <div className="col-md-12">
                      <label className="form-label">Email *</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-envelope"></i>
                        </span>
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          placeholder="Enter email"
                          value={newEmployee.email}
                          onChange={handleChangeNew}
                        />
                      </div>
                    </div>

                    <div className="col-md-12">
                      <label className="form-label">Password *</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-shield-lock"></i>
                        </span>
                        <input
                          type="password"
                          className="form-control"
                          name="password"
                          placeholder="Enter password"
                          value={newEmployee.password}
                          onChange={handleChangeNew}
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Role</label>
                      <select
                        className="form-select"
                        name="role"
                        value={newEmployee.role}
                        onChange={handleChangeNew}
                      >
                        <option value="Admin">Admin</option>
                        <option value="Employee">Employee</option>
                        <option value="HR">HR</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    className="btn btn-primary"
                    onClick={handleCreateEmployee}
                  >
                    <i className="bi bi-check-circle me-2"></i>
                    Register User
                  </button>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
            <div
              className=" fade show"
              onClick={() => setShowCreateModal(false)}
            ></div>
          </div>
        )}

        {/* EDIT EMPLOYEE MODAL */}
        {showEditModal && (
          <div className="modal d-block" tabIndex="-1">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="bi bi-pencil-square me-2"></i>
                    Edit Employee (ID: {editForm.id})
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowEditModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="Name"
                        placeholder={
                          editForm.Name
                            ? `Current: ${editForm.Name}`
                            : "Enter employee name"
                        }
                        value={editForm.Name}
                        onChange={handleChangeEdit}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Position</label>
                      <input
                        type="text"
                        className="form-control"
                        name="position"
                        placeholder={
                          editForm.position
                            ? `Current: ${editForm.position}`
                            : "Enter position"
                        }
                        value={editForm.position}
                        onChange={handleChangeEdit}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Department</label>
                      <input
                        type="text"
                        className="form-control"
                        name="department"
                        placeholder={
                          editForm.department
                            ? `Current: ${editForm.department}`
                            : "Enter department"
                        }
                        value={editForm.department}
                        onChange={handleChangeEdit}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Salary</label>
                      <input
                        type="number"
                        className="form-control"
                        name="salary"
                        placeholder={
                          editForm.salary
                            ? `Current: ${editForm.salary}`
                            : "Enter salary"
                        }
                        value={editForm.salary}
                        onChange={handleChangeEdit}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Joining Date</label>
                      <input
                        type="date"
                        className="form-control"
                        name="joiningDate"
                        value={editForm.joiningDate}
                        onChange={handleChangeEdit}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Shift Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="shiftName"
                        placeholder={
                          editForm.shiftName
                            ? `Current: ${editForm.shiftName}`
                            : "Enter shift name"
                        }
                        value={editForm.shiftName}
                        onChange={handleChangeEdit}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Shift Start Time (e.g. 09:00 AM)
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="shiftStartTime"
                        placeholder="09:00 AM"
                        value={editForm.shiftStartTime}
                        onChange={handleChangeEdit}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Shift End Time (e.g. 05:00 PM)
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="shiftEndTime"
                        placeholder="05:00 PM"
                        value={editForm.shiftEndTime}
                        onChange={handleChangeEdit}
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    className="btn btn-primary"
                    onClick={handleUpdateEmployee}
                  >
                    <i className="bi bi-save me-2"></i>
                    Save Changes
                  </button>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
            <div
              className=" fade show"
              onClick={() => setShowEditModal(false)}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Employees;
