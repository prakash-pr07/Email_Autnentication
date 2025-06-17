// src/pages/OtpVerificationPage.jsx

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const OtpVerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = new URLSearchParams(location.search).get("email") || "";

  const [otp, setOtp] = useState("");
  const [formData, setFormData] = useState(() => {
    const stored = localStorage.getItem("signupData");
    return stored ? JSON.parse(stored) : null;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData || !email || !otp) return toast.error("Missing OTP or Email");

    try {
      const res = await axios.post("http://localhost:4000/api/v1/signup", {
        ...formData,
        email,
        otp,
      });

      if (res.data.success) {
        toast.success("Signup successful");
        localStorage.removeItem("signupData");
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen bg-yellow-200 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Verify OTP</h2>

        <div>
          <label className="block font-semibold mb-1">Email</label>
          <input
            type="email"
            value={email}
            readOnly
            className="w-full p-2 border border-gray-300 rounded bg-gray-100"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">OTP</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-800 text-white py-2 rounded hover:bg-blue-900"
        >
          Verify OTP
        </button>
      </form>
    </div>
  );
};

export default OtpVerificationPage;
