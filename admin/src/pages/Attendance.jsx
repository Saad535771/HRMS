import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Card,
  Chip,
  Avatar,
  Stack,
  Divider,
} from "@mui/material";

import Sidebar from "../components/Sidebar";
import TopBar from "../components/AppBar";

import { checkIn, checkOut, getAttendanceByUserId } from "../services/attendanceService";

const Attendance = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [progress, setProgress] = useState(0);
  const [totalHours, setTotalHours] = useState(0);

  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("username");

  // Wrap fetchAttendance in useCallback to avoid useEffect warning
  const fetchAttendance = useCallback(async () => {
    if (!userId) return;

    try {
      const records = await getAttendanceByUserId(userId);
      setAttendanceRecords(records);

      if (records.length > 0) {
        const last = records[records.length - 1];

        const hours = last.totalHours || 0;
        setTotalHours(hours);
        setProgress((hours / 9) * 100);
        setIsCheckedIn(last.inOutStatus === "IN");
      }
    } catch (err) {
      setMessage("Failed to load attendance records.");
    }
  }, [userId]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const handleAttendance = async (type) => {
    setLoading(true);
    setMessage("");

    try {
      let response;

      if (type === "check-in") {
        response = await checkIn(userId);
        setIsCheckedIn(true);
      } else {
        response = await checkOut(userId);
        setIsCheckedIn(false);
      }

      setMessage(response.message);
      fetchAttendance();
    } catch (err) {
      setMessage(err.toString());
    }

    setLoading(false);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      <Box sx={{ flexGrow: 1, p: 3 }}>
        <TopBar />

        {/* HEADER */}
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <Typography variant="h4">{userName} — Attendance</Typography>

          <Button
            variant="contained"
            color={isCheckedIn ? "secondary" : "primary"}
            onClick={() => handleAttendance(isCheckedIn ? "check-out" : "check-in")}
            disabled={loading}
            sx={{ mt: 3 }}
          >
            {loading ? <CircularProgress size={24} /> : isCheckedIn ? "Check Out" : "Check In"}
          </Button>

          {message && <Typography sx={{ mt: 2 }} color="primary">{message}</Typography>}
        </Box>

        {/* LIVE PROGRESS */}
        <Card sx={{ mt: 4, p: 3, textAlign: "center", borderRadius: 3 }}>
          <Typography variant="h6">Today's Work Progress</Typography>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ height: 12, borderRadius: 5, my: 2 }}
          />
          <Typography>{totalHours.toFixed(2)} / 9 hours</Typography>
        </Card>

        {/* ATTENDANCE HISTORY */}
        <Card sx={{ mt: 4, p: 3, borderRadius: 3 }}>
          <Typography variant="h6">Attendance History</Typography>
          <Divider sx={{ my: 2 }} />

          <List>
            {attendanceRecords.length > 0 ? (
              attendanceRecords.map((rec, i) => (
                <ListItem key={i} sx={{ justifyContent: "space-between" }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar>{i + 1}</Avatar>
                    <ListItemText
                      primary={`Date: ${rec.date}`}
                      secondary={`Hours: ${rec.totalHours?.toFixed(2) || 0}`}
                    />
                  </Stack>

                  <Chip
                    label={rec.inOutStatus === "IN" ? "Checked In" : "Checked Out"}
                    color={rec.inOutStatus === "IN" ? "success" : "default"}
                  />
                </ListItem>
              ))
            ) : (
              <Typography>No attendance records found.</Typography>
            )}
          </List>
        </Card>
      </Box>
    </Box>
  );
};

export default Attendance;
