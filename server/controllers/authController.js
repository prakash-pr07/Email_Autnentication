// controllers/authController.js

const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const OTP = require("../models/otpModel");
const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");


// SignUp //
exports.signUp = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNo,
      password,
      confirmPassword,
      city,
      state,
      role,
      otp,
    } = req.body;

    // ✅ Step 1: Field validation
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phoneNo ||
      !password ||
      !confirmPassword ||
      !city ||
      !state ||
      !role ||
      !otp
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ✅ Step 2: Check password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password do not match",
      });
    }

    // ✅ Step 3: Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please log in.",
      });
    }

    // ✅ Step 4: OTP check (find latest OTP for that email)
    const recentOTP = await OTP.findOne({ email }).sort({ createdAt: -1 }).limit(1);
    if (!recentOTP || recentOTP.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // ✅ Step 5: Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Step 6: Create User
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      phoneNo,
      password: hashedPassword,
      city,
      state,
      role,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      success: false,
      message: "Signup failed. Please try again later.",
    });
  }
};



// Send OTP //

exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Validation
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists, please log in.",
      });
    }

    // Generate OTP (6 digit numeric)
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    //  Save OTP to DB
    await OTP.create({
      email,
      otp,
      createdAt: new Date(),
    });

    // Setup nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email Options
    const mailOptions = {
      from: `"LoGic Legal" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP for LoGic Legal Verification",
      text: `Your OTP is: ${otp}. It is valid for 5 minutes.`,
    };

    // Send Email
    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Error while sending OTP:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP, please try again later.",
    });
  }
};


// ====================== LOGIN ======================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found. Please sign up.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Login failed. Please try again.",
    });
  }
};
