import React, { useState } from "react";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import { submitOvertime } from "../services/attendanceService";

const OvertimeSubmit = ({ attendanceId, date, shiftStart, shiftEnd, workingHours, shiftHours }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const userId = localStorage.getItem("userId");

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await submitOvertime({
        userId,
        attendanceId,
        date,
        shiftStart,
        shiftEnd,
        workingHours,
        shiftHours
      });

      setMessage(response.message);
    } catch (error) {
      setMessage(error.message || "Overtime submission failed");
    }

    setLoading(false);
  };

  return (
    <Box sx={{ p: 3, background: "#fff", borderRadius: 2, boxShadow: 1, mt: 3 }}>
      <Typography variant="h6" gutterBottom>Submit Overtime</Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : "Submit Overtime"}
      </Button>

      {message && <Typography color="success.main" sx={{ mt: 2 }}>{message}</Typography>}
    </Box>
  );
};

export default OvertimeSubmit;
