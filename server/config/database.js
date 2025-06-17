const mongoose = require("mongoose");

exports.connect = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    console.log("DB is connected Successfully");
  } catch (error) {
    console.error("DB connection failed");
    console.error(error);
    process.exit(1);
  }
};

