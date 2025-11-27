import { useEffect, useState } from "react";
import { 
  getAllAttendance, 
  approveAttendance, 
  deleteAttendance 
} from "../services/attendanceService";
import AdminOverTime from "./AdminOverTime";
import AdminMonthlyReport from "./AdminMonthlyReport";
import { 
  Box, Button, Typography, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, CircularProgress 
} from "@mui/material";

import Sidebar from "../components/Sidebar";
import TopBar from "../components/AppBar";

const AdminAttendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAllAttendance();
  }, []);

  const fetchAllAttendance = async () => {
    setLoading(true);
    try {
      const records = await getAllAttendance();

      // Format records
      const formattedRecords = records.map((record) => ({
        ...record,
        approvalStatusDisplay:
          record.approvalStatus === "Approved"
            ? "Approved"
            : record.approvalStatus === "Rejected"
            ? "Rejected"
            : "Pending",
      }));

      setAttendanceRecords(formattedRecords);
    } catch (error) {
      setMessage("Failed to fetch attendance records.");
    }
    setLoading(false);
  };

  const handleApprovalChange = async (attendanceIds, status) => {
    setLoading(true);
    try {
      await approveAttendance(attendanceIds, status);
      setMessage(`Attendance ${status.toLowerCase()} successfully!`);
      fetchAllAttendance();
    } catch (error) {
      console.error(error);
      setMessage(`Failed to ${status.toLowerCase()} attendance.`);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await deleteAttendance(id);
      setMessage("Record deleted successfully!");
      fetchAllAttendance();
    } catch (error) {
      console.error(error);
      setMessage("Failed to delete attendance record.");
    }
    setLoading(false);
  };

  return (
    <Box sx={{ display: "flex", background: "#f4f4f4", minHeight: "100vh" }}>
      <Sidebar />

      <Box sx={{ flexGrow: 1, p: 3 }}>
        <TopBar />

        <Box sx={{ textAlign: "center", mt: 5 }}>
          <Typography variant="h4" gutterBottom>
            Admin Attendance Management
          </Typography>

          {loading && <CircularProgress />}
          {message && (
            <Typography color="success.main" sx={{ mt: 2 }}>
              {message}
            </Typography>
          )}

          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><b>Employee ID</b></TableCell>
                  <TableCell><b>Date</b></TableCell>
                  <TableCell><b>Status</b></TableCell>
                  <TableCell><b>Total Hours</b></TableCell>
                  <TableCell><b>Approval Status</b></TableCell>
                  <TableCell><b>Actions</b></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {attendanceRecords.length > 0 ? (
                  attendanceRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.userId}</TableCell>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{record.status}</TableCell>
                      <TableCell>{record.totalHours || "0"}</TableCell>
                      <TableCell>{record.approvalStatusDisplay}</TableCell>

                      <TableCell>
                        {record.approvalStatus === "Pending" ? (
                          <>
                            <Button
                              variant="contained"
                              color="success"
                              onClick={() =>
                                handleApprovalChange([record.id], "Approved")
                              }
                              sx={{ mr: 1 }}
                            >
                              Approve
                            </Button>

                            <Button
                              variant="contained"
                              color="warning"
                              onClick={() =>
                                handleApprovalChange([record.id], "Rejected")
                              }
                              sx={{ mr: 1 }}
                            >
                              Reject
                            </Button>

                            <Button
                              variant="contained"
                              color="error"
                              onClick={() => handleDelete(record.id)}
                            >
                              Delete
                            </Button>
                          </>
                        ) : (
                          <Typography color="text.secondary">
                            No Actions
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No records found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>

            </Table>
          </TableContainer>
        </Box>
<AdminOverTime />
<AdminMonthlyReport/>
      </Box>
    </Box>
  );
};

export default AdminAttendance;
