// src/pages/SignupPage.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const SignupPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    password: "",
    confirmPassword: "",
    city: "",
    state: "",
    role: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOtpAndRedirect = async (e) => {
    e.preventDefault();
    const { email } = formData;

    if (!email) {
      return toast.error("Please enter your email before proceeding");
    }

    try {
      const res = await axios.post("http://localhost:4000/api/v1/send-otp", { email });

      if (res.data.success) {
        toast.success("OTP sent successfully to your email");
        localStorage.setItem("signupData", JSON.stringify(formData));
        navigate(`/verify-otp?email=${email}`);
      } else {
        toast.error(res.data.message || "Failed to send OTP");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error sending OTP");
    }
  };

  return (
    <div className="min-h-screen bg-yellow-200 flex justify-center items-center">
      <form
        onSubmit={handleSendOtpAndRedirect}
        className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Signup</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">First Name</label>
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Last Name</label>
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Phone Number</label>
          <input
            name="phoneNo"
            value={formData.phoneNo}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">City</label>
            <input
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">State</label>
            <input
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-1">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="Client">Client</option>
            <option value="Lawyer">Lawyer</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-800 text-white py-2 rounded hover:bg-blue-900"
        >
          Send OTP & Continue
        </button>
      </form>
    </div>
  );
};

export default SignupPage;
