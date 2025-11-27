import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import  load from "../assets/login/logo.png";
import  logo from "../assets/login/Logo-White.png";
import bg from '../assets/login/bg.png';
import BaseUrl from "../api/baseurl.js";
const EmailIcon = <i className="fa-solid fa-envelope me-2"></i>;
const PersonIcon = <i className="fa-solid fa-user me-2"></i>;
const SecurityIcon = <i className="fa-solid fa-key me-2"></i>;
const PhoneIcon = <i className="fa-solid fa-phone me-2"></i>;
const Register = () => {
  const server_Url = BaseUrl();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Employee");
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  const generateUserId = () => {
    return "USR-" + Math.floor(100000 + Math.random() * 900000);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password || !phone) {
      alert("All fields are required");
      return;
    }
    const user_id = generateUserId();
    try {
      const response = await axios.post(
        server_Url + "users/register",
        {
          first_name: firstName,
          last_name: lastName,
          phone,
          email,
          password,
          role,
          user_id,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      setOpenDialog(true);
      console.log(response?.data)
      setTimeout(() => {
        setOpenDialog(false);
        navigate("/login");
      }, 2000);
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  const glassmorphismStyle = {
    backdropFilter: "blur(5px)",
    background: "rgba(210, 215, 219, 0.28)",
    boxShadow: "0 8px 32px rgba(78, 78, 78, 0.55)",
    color: "#fff",
    borderRadius: "20px",
  };

  const inputCustomStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderColor: "rgba(255,255,255,0.4)",
    color: "#fff",
  };

  const buttonCustomStyle = {
    padding: "5px",
    borderRadius: "25px",
    background: "#2977edff",
   
  };
  return (
    <div
      className="d-flex justify-content-center align-items-center p-3"
      style={{
        height: "100vh",
        width: "100%",
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Glassmorphism Card (Paper) */}
      <div
        className="p-4 text-center"
        style={{
          ...glassmorphismStyle,
          width: "90%",
          maxWidth: "450px",
        }}>
        {/* Logo */}
        <div className="text-center mb-3">
          <img src={logo} alt="Logo" width={100} className="img-fluid" />
        </div>
        {/* Register Heading */}
        <h5 className="mt-2 fw-bold text-white">
          Register New User
        </h5>
        {/* Sub-Text */}
        <p className="mb-4" style={{ opacity: 0.8 }}>
          Fill all the required details
        </p>
        <form onSubmit={handleRegister}>
          <div className="row g-2">
            {/* First Name */}
            <div className="col-12 col-sm-6 mb-3">
              <div className="input-group">
                <span className="input-group-text bg-transparent border-0" style={{ color: "#fff" }}>
                  {PersonIcon}
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="First Name"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  style={inputCustomStyle}
                />
              </div>
            </div>

            {/* Last Name */}
            <div className="col-12 col-sm-6 mb-3">
              <div className="input-group">
                <span className="input-group-text bg-transparent border-0" style={{ color: "#fff" }}>
                  {PersonIcon}
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Last Name"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  style={inputCustomStyle}
                />
              </div>
            </div>
          

          {/* Phone */}
          <div className="col-12 col-sm-6 mb-3">
            <div className="input-group">
              <span className="input-group-text bg-transparent border-0" style={{ color: "#fff" }}>
                {PhoneIcon}
              </span>
              <input
                type="tel"
                className="form-control"
                placeholder="Phone"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={inputCustomStyle}
              />
            </div>
          </div>

          {/* Email */}
          <div className="col-12 col-sm-6 mb-3">
            <div className="input-group">
              <span className="input-group-text bg-transparent border-0" style={{ color: "#fff" }}>
                {EmailIcon}
              </span>
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputCustomStyle}
              />
            </div>
          </div>

          {/* Password */}
          <div className="col-12 col-sm-6 mb-3">
            <div className="input-group">
              <span className="input-group-text bg-transparent border-0" style={{ color: "#fff" }}>
                {SecurityIcon}
              </span>
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputCustomStyle}
              />
            </div>
          </div>

          {/* Role (Select) */}
          <div className="col-12 col-sm-6 mb-3">
            <select
              className="form-select"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={inputCustomStyle}
            >
              <option value="Employee">Employee</option>
              <option value="Admin">Admin</option>
              <option value="HR">HR</option>
            </select>
          </div>
          </div>
          {/* Button */}
          <button
            type="submit"
            className="btn btn-primary px-3"
            style={buttonCustomStyle}
          >
            Register
          </button>
        </form>
      </div>

      {/* Success Dialog (Modal) */}
      {openDialog && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setOpenDialog(false)} // Close on clicking outside (optional)
        >
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-body p-4 text-center">
                <img src={load} alt="Loading..." width={300} className="img-fluid" />
                <h6 className="mt-3">Registration Successful!</h6>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;