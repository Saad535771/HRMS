import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // Correct import
import { getMonthlyAttendanceReport } from "../services/attendanceService";

const AdminMonthlyReport = () => {
  const [userId, setUserId] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const months = [
    { value: 1, label: "January" }, { value: 2, label: "February" },
    { value: 3, label: "March" }, { value: 4, label: "April" },
    { value: 5, label: "May" }, { value: 6, label: "June" },
    { value: 7, label: "July" }, { value: 8, label: "August" },
    { value: 9, label: "September" }, { value: 10, label: "October" },
    { value: 11, label: "November" }, { value: 12, label: "December" },
  ];

  // Fetch Report
  const fetchReport = async () => {
    if (!userId) {
      setMessage("Please enter User ID.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const data = await getMonthlyAttendanceReport(userId, month, year);
      setReportData(data);
    } catch (err) {
      console.error(err);
      setMessage("Error fetching report.");
    }

    setLoading(false);
  };

  // Download PDF
  const handleDownload = () => {
    if (reportData.length === 0) {
      setMessage("No data available to download.");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(`Monthly Attendance Report - ${month}/${year}`, 14, 15);

    const tableData = reportData.map((rec) => [
      rec.date,
      rec.employeeName || "N/A",
      rec.employeeEmail || "N/A",
      rec.totalHours?.toFixed(2) || "0",
      rec.overtimeHours?.toFixed(2) || "0",
      rec.status,
      rec.approvalStatus,
    ]);

    // Correct usage of autoTable
    autoTable(doc, {
      startY: 25,
      head: [["Date", "Name", "Email", "Total Hours", "Overtime", "Status", "Approval"]],
      body: tableData,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [40, 40, 40] },
    });

    doc.save(`attendance_report_${month}_${year}.pdf`);
  };

  return (
    <div className="container py-4">
      <h3 className="text-center mb-4 fw-bold">
        Admin Monthly Attendance Report
      </h3>

      {/* Filters */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <label className="form-label">User ID</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </div>

        <div className="col-md-3">
          <label className="form-label">Month</label>
          <select
            className="form-select"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {months.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>

        <div className="col-md-2">
          <label className="form-label">Year</label>
          <input
            type="number"
            className="form-control"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          />
        </div>

        <div className="col-md-2 d-grid">
          <button
            className="btn btn-primary mt-4"
            onClick={fetchReport}
            disabled={loading}
          >
            {loading ? "Loading..." : "Fetch"}
          </button>
        </div>

        <div className="col-md-2 d-grid">
          <button
            className="btn btn-success mt-4"
            onClick={handleDownload}
            disabled={reportData.length === 0}
          >
            Download PDF
          </button>
        </div>
      </div>

      {message && <div className="alert alert-danger">{message}</div>}

      {/* Table */}
      {reportData.length > 0 && (
        <div className="table-responsive mt-4">
          <table className="table table-bordered table-striped text-center">
            <thead className="table-dark">
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Email</th>
                <th>Total Hours</th>
                <th>Overtime</th>
                <th>Status</th>
                <th>Approval</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((rec, idx) => (
                <tr key={idx}>
                  <td>{rec.date}</td>
                  <td>{rec.employeeName || "N/A"}</td>
                  <td>{rec.employeeEmail || "N/A"}</td>
                  <td>{rec.totalHours?.toFixed(2) || "0"}</td>
                  <td>{rec.overtimeHours?.toFixed(2) || "0"}</td>
                  <td>{rec.status}</td>
                  <td>{rec.approvalStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminMonthlyReport;
