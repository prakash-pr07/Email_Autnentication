const express = require("express");
const app = express();

require("dotenv").config();
const PORT = process.env.PORT || 4000;

const cors = require("cors");
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(express.json());

// DB Connection
const { connect } = require("./config/database");
connect();

// Routes
const userRoutes = require("./routes/userRoute");
app.use("/api/v1", userRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`App is listening at ${PORT}`);
});
