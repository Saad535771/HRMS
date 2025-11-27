import React, { useState, useEffect } from "react";
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress } from "@mui/material";
import { getAllOvertime, approveOvertime, deleteOvertime } from "../services/attendanceService";
const AdminOverTime = () => {
  const [overtimeRecords, setOvertimeRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchOvertimeRecords();
  }, []);

  const fetchOvertimeRecords = async () => {
    setLoading(true);
    try {
      const records = await getAllOvertime();
      setOvertimeRecords(records);
    } catch (error) {
      setMessage("Failed to fetch overtime records");
    }
    setLoading(false);
  };

  const handleApprove = async (ids, status) => {
    setLoading(true);
    try {
      await approveOvertime(ids, status);
      setMessage(`Overtime ${status.toLowerCase()} successfully`);
      fetchOvertimeRecords();
    } catch (error) {
      setMessage("Failed to update status");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await deleteOvertime(id);
      setMessage("Overtime record deleted successfully");
      fetchOvertimeRecords();
    } catch (error) {
      setMessage("Failed to delete record");
    }
    setLoading(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Overtime Management</Typography>
      {loading && <CircularProgress />}
      {message && <Typography color="success.main">{message}</Typography>}

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Working Hours</TableCell>
              <TableCell>Shift Hours</TableCell>
              <TableCell>Overtime Hours</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {overtimeRecords.length > 0 ? (
              overtimeRecords.map((rec) => (
                <TableRow key={rec.id}>
                  <TableCell>{rec.userId}</TableCell>
                  <TableCell>{rec.date}</TableCell>
                  <TableCell>{rec.workingHours}</TableCell>
                  <TableCell>{rec.shiftHours}</TableCell>
                  <TableCell>{rec.overtimeHours}</TableCell>
                  <TableCell>{rec.status}</TableCell>
                  <TableCell>
                    {rec.status === "Pending" && (
                      <>
                        <Button variant="contained" color="success" sx={{mr:1}} onClick={()=>handleApprove([rec.id],"Approved")}>Approve</Button>
                        <Button variant="contained" color="warning" sx={{mr:1}} onClick={()=>handleApprove([rec.id],"Rejected")}>Reject</Button>
                        <Button variant="contained" color="error" onClick={()=>handleDelete(rec.id)}>Delete</Button>
                      </>
                    )}
                    {rec.status !== "Pending" && <Typography color="text.secondary">No Actions</Typography>}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">No overtime records found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminOverTime;
